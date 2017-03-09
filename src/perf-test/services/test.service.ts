import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuthState, } from 'angularfire2';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable  } from 'rxjs/Observable';
import { Subject as OSubject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/every';

import { ICourse } from '../models/course';
import { ISubject, Subject } from '../models/subject';
import {  Rule, Result } from '../models/rule';
import {  IFaculty, Faculty } from '../models/faculty';

interface ICourseOperation extends Function {
  (courses: ICourse[]): ICourse[];
}



@Injectable()
export class TestService {
  newCourses: OSubject<ICourse> = new OSubject<ICourse>();
  courses$: Observable<ICourse[]>;
  updates: OSubject<any> = new OSubject<any>();
  // action streams
  create: OSubject<ICourse> = new OSubject<ICourse>();

  private subjects$: Observable<ISubject[]>;
  private faculties$: Observable<IFaculty[]>;
  private readonly COURSES = '/courses';
  private readonly SUBJECTS = '/subjects';
  private readonly FACULTIES = 'faculties';
  private initialCourses: ICourse[] = [];
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
        this.courses$ = this.updates
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
      .refCount();

    this.create
      .map( function(course: ICourse): ICourseOperation {
        return (courses: ICourse[]) => {
          console.log('calling create');
          return courses.concat(course);
        };
      })
      .subscribe(this.updates); 

     this.newCourses
      .subscribe(this.create);   
        
   }

   addCourse(course: ICourse)
   {
      console.log('add course');
      this.newCourses.next(course);
   }

  setFaculty(faculty: IFaculty)
  {
    console.log(`starting faculty query`, new Date().toUTCString());
    this.filterFaculty.next(faculty.name);
  }

  setSubject(subject: ISubject)
  {
    console.log(`starting subject query`, new Date().toUTCString());
    this.filterSubject.next(subject.name);
  }  

  setLevel(level: any)
  {
    console.log(`starting level filter`, new Date().toUTCString());
    this.filterLevel.next(level.id);
  }    

  getCourses() : Observable<any[]>
  {
      //this works but courses is not ready until we choose level
       return this.filterLevel.withLatestFrom(this.af.database.list(this.COURSES, { 
       query: {
        orderByChild: 'subject',
        equalTo: this.filterSubject 
      }}), (level, courses) => (courses).filter((course) => { return course.level === level}));
  }
   getFaculties(): Observable<IFaculty[]> {
    this.faculties$ = this.af.database.list(this.FACULTIES, {
       query: {
        orderByChild: 'name'
      }
    })
    .map((faculties) => { 
      return faculties.map((faculty)=> {
      return new Faculty(faculty);
    })});
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
      return subjects.map((subject)=> {
      return new Subject(subject);
    })});
    return this.subjects$;
  }  

}

/*
 return this.filterLevel.switchMap(level => {
       
       if(level == undefined)
       {
           return this.af.database.list(this.COURSES, { 
        query: {
          orderByChild: 'subject',
          equalTo: this.filterSubject 
        }})
       }else{
           return this.af.database.list(this.COURSES, { 
       query: {
        orderByChild: 'subject',
        equalTo: this.filterSubject 
      }}).map(courses => {
         courses.filter( course => {
           return course.level.id ===  level
         })
        })
       }
      });
*/