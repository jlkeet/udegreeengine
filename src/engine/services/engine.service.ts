import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuthState, } from 'angularfire2';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject as OSubject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/every';

import { ICourse } from '../models/course';
import { ISubject, Subject } from '../models/subject';
import { Rule, Result, IRule } from '../models/rule';
import { IFaculty, Faculty } from '../models/faculty';

interface ICourseOperation extends Function {
  (courses: ICourse[]): ICourse[];
}



@Injectable()
export class EngineService {
  //selected Courses
  newCourses: OSubject<ICourse> = new OSubject<ICourse>();
  selectedCourses$: Observable<ICourse[]>;
  updates: OSubject<any> = new OSubject<any>();
  create: OSubject<ICourse> = new OSubject<ICourse>();
  remove: OSubject<ICourse> = new OSubject<ICourse>();

  //availalble courses
  allCourses$: Observable<ICourse[]>;
  filterAvailableByLevel: OSubject<ICourse> = new OSubject<ICourse>();

  //Errors
  allRules$: Observable<IRule[]>;
  checkrules: OSubject<any> = new OSubject<any>();
  errors$: Observable<Result[]>;

  private subjects$: Observable<ISubject[]>;
  private faculties$: Observable<IFaculty[]>;
  private readonly COURSES = '/courses';
  private readonly SUBJECTS = '/subjects';
  private readonly FACULTIES = '/faculties';
  private readonly DEGREES = '/degrees';
  private readonly RULES = '/rules';
  private initialCourses: ICourse[] = [];
  private initialCourseList: ICourse[] = [];
  private courses: ICourse[] = [];


  private rules: IRule[] = [];
  private filterFaculty: OSubject<string> = new OSubject<string>();
  private filterSubject: OSubject<string> = new OSubject<string>();
  private filterLevel: OSubject<number> = new OSubject<number>();
  private filterDegree: OSubject<string> = new OSubject<string>();

  getLevels(): any[] {
    return [
      { id: 1, name: 'Level One' },
      { id: 2, name: 'Level Two' },
      { id: 3, name: 'Level Three' }
    ]
  }

  getSemesters(): any[] {
     return [ 1, 2, 3 ]
  }

  constructor(private af: AngularFire) {

    // SELECTED COURSE
    this.selectedCourses$ = this.updates
      // watch the updates and accumulate operations on the messages
      .scan((courses: ICourse[],
        operation: ICourseOperation) => {
        return operation(courses);
      },
      this.initialCourses)
      // make sure we can share the most recent list of courses across anyone
      // who's interested in subscribing and cache the last known list of
      // courses. To ensure that combineLatest first, intialise this observable with empty []
      .publishReplay(1)
      .refCount()
      .startWith([]);

    // defines the create operation (concat) updates will fire
    this.create
      .map(function (course: ICourse): ICourseOperation {
        return (courses: ICourse[]) => {
          return courses.concat(course);
        };
      })
      .subscribe(this.updates);

    this.remove
      .map(function (course: ICourse): ICourseOperation {
        return (courses: ICourse[]) => {
          let index = courses.findIndex(c => { return c.$key === course.$key });
          courses.splice(index, 1);
          return courses;
        };
      })
      .subscribe(this.updates);

    // when next is called on newCourses, create will fire with course as param
    this.newCourses
      .subscribe(this.create);


    this.allRules$ = this.getRules().
      map(rules => {
        return rules.map(r => {
          return new Rule(r);
        })
      })
    this.allRules$.subscribe(rules => {
      this.rules = rules;
    });

    //currently we always use this degree
    this.filterDegree.next('B1');


    this.errors$ = this.selectedCourses$
      .scan(
      //accumulator
      (results: Result[], courses: ICourse[]) => {
        return this.checkRules(courses, this.rules);
      },
      //seed
      []);
  }

  checkRules(courses: ICourse[], rules: IRule[]) {
    //check list of selected courses against all Rules
    // A rule needs to return TRUE/ FALSE and if false an error message(s)
    let results: Result[] = [];
    rules.forEach((rule) => {

      results = results.concat(rule.evaluate(courses));
    });
    return results;
  }

  addCourse(semester: number, course: ICourse) {
    course.semester = semester;
    this.newCourses.next(course);
  }

  removeCourse(course: ICourse) {
    this.remove.next(course);
  }

  setFaculty(faculty: IFaculty) {
    this.filterFaculty.next(faculty.name);
  }

  setSubject(subject: ISubject) {
    this.filterSubject.next(subject.name);
  }

  setLevel(level: any) {
    this.filterLevel.next(level.id);
  }

  getCourses(): Observable<any> {
    // only when filterSubject emits a value, fetch course list from Firebase
    // course list will be filtered and ordered by subject (emitted value of filterSubject) 
    this.allCourses$ = this.af.database.list(this.COURSES, {
      query: {
        orderByChild: 'subject',
        equalTo: this.filterSubject
      }
    });

    // combine the latest emit from allCourses$ AND selectedCourses$    
    // and remove any courses not at the selected level
    const filteredByLevel = this.allCourses$.combineLatest(this.filterLevel)
      .map(data => {
        let courses = data[0];
        let level = data[1];
        return courses.filter(c => c.level === level)
      });

    // combine the latest emit from filteredByLevel AND selectedCourses$
    // and remove any courses that have already been selected
    const withoutSelected = filteredByLevel.combineLatest(this.selectedCourses$)
      .map(courses => {
        console.log('rereshing courses');
        let available = courses[0];
        let selected = courses[1];
        return available.filter(c => {
          return !selected.find(s => { return s.$key == c.$key });
        });
      });

    return withoutSelected;
  }

  getRules(): Observable<IRule[]> {
    this.allRules$ = this.af.database.list(this.RULES, {
      query: {
        orderByChild: 'degree',
        equalTo: this.filterDegree
      }
    });
    return this.allRules$;

  }
  getFaculties(): Observable<IFaculty[]> {
    this.faculties$ = this.af.database.list(this.FACULTIES, {
      query: {
        orderByChild: 'name'
      }
    })
      .map((faculties) => {
        return faculties.map((faculty) => {
          return new Faculty(faculty);
        })
      });
    return this.faculties$;
  }

  getsSubjects(): Observable<ISubject[]> {
    this.subjects$ = this.af.database.list(this.SUBJECTS, {
      query: {
        orderByChild: 'faculty',
        equalTo: this.filterFaculty
      }
    })
      .map((subjects) => {
        return subjects.map((subject) => {
          return new Subject(subject);
        })
      });
    return this.subjects$;
  }

}

