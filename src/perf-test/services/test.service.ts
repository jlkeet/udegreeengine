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

@Injectable()
export class TestService {
  private course$: FirebaseListObservable<ICourse[]>;
  private subjects$: Observable<ISubject[]>;
  private faculties$: Observable<IFaculty[]>;
  private readonly COURSES = '/courses';
  private readonly SUBJECTS = '/subjects';
  private readonly FACULTIES = 'faculties';

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

  constructor(private af: AngularFire) {  }

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
      return this.af.database.list(this.COURSES, { 
       query: {
        orderByChild: 'subject',
        equalTo: this.filterSubject 
      }});
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