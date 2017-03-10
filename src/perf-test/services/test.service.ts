import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuthState, } from 'angularfire2';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject as OSubject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/every';

import { ICourse } from '../models/course';
import { ISubject, Subject } from '../models/subject';
import { Rule, Result } from '../models/rule';
import { IFaculty, Faculty } from '../models/faculty';

interface ICourseOperation extends Function {
  (courses: ICourse[]): ICourse[];
}



@Injectable()
export class TestService {
  //selected Courses
  newCourses: OSubject<ICourse> = new OSubject<ICourse>();
  selectedCourses$: Observable<ICourse[]>;
  updates: OSubject<any> = new OSubject<any>();
  create: OSubject<ICourse> = new OSubject<ICourse>();
  remove: OSubject<ICourse> = new OSubject<ICourse>();
  //availalble courses
  allCourses$: Observable<ICourse[]>;
  availableCourses$: Observable<ICourse[]>;
  filters: OSubject<any> = new OSubject<any>();
  filterAvailableByLevel: OSubject<ICourse> = new OSubject<ICourse>();

  private subjects$: Observable<ISubject[]>;
  private faculties$: Observable<IFaculty[]>;
  private readonly COURSES = '/courses';
  private readonly SUBJECTS = '/subjects';
  private readonly FACULTIES = 'faculties';
  private initialCourses: ICourse[] = [];
  private initialCourseList: ICourse[] = [];
  private courses: ICourse[] = [];

  private filterFaculty: OSubject<string> = new OSubject<string>();
  private filterSubject: OSubject<string> = new OSubject<string>();
  private filterLevel: OSubject<number> = new OSubject<number>();

  getLevels(): any[] {
    return [
      { id: 1, name: 'Level One' },
      { id: 2, name: 'Level Two' },
      { id: 3, name: 'Level Three' }
    ]
  }

  constructor(private af: AngularFire) {

    // SELECTED COURSE
    this.selectedCourses$ = this.updates
      // watch the updates and accumulate operations on the messages
      .scan((courses: ICourse[],
        operation: ICourseOperation) => {
        console.log('calling updates');
        return operation(courses);
      },
      this.initialCourses)
      // make sure we can share the most recent list of messages across anyone
      // who's interested in subscribing and cache the last known list of
      // messages
      .publishReplay(1)
      .refCount()
      .startWith([]);

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
          console.log('calling remove course');
          let index = courses.findIndex(c => { return c.$key === course.$key });
          courses.splice(index, 1);
          return courses;
        };
      })
      .subscribe(this.updates);

    this.newCourses
      .subscribe(this.create);

    // AVAILABLE COURSES
    //   this.availableCourses$ = this.filters
    //   // watch the updates and accumulate operations on the messages
    //   .scan((courses: ICourse[],
    //          operation: ICourseOperation) => {
    //            console.log('calling filters');
    //            return operation(courses);
    //          },
    //         this.allCourses$)
    //   // make sure we can share the most recent list of messages across anyone
    //   // who's interested in subscribing and cache the last known list of
    //   // messages
    //   .publishReplay(1)
    //   .refCount();

    //  this.filterAvailableByLevel
    //   .filter( function(level: string)  {
    //     return (courses: ICourse[]) => {
    //       console.log('calling filter by level');
    //       return courses.filter( c => {
    //         return c.level === level;
    //       });
    //     };
    //   })
    //   .subscribe(this.filters);

  }

  addCourse(course: ICourse) {
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
        return courses.filter(c => c.level === level) });

    // combine the latest emit from filteredByLevel AND selectedCourses$
    // and remove any courses that have already been selected
    const withoutSelected = filteredByLevel.combineLatest(this.selectedCourses$)
      .map(courses => {
        let available = courses[0];
        let selected = courses[1];
        return available.filter(c => {
          return !selected.find(s => { return s.$key == c.$key });
        });
      });

    return withoutSelected;
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

