import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuthState, } from 'angularfire2';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/every';
import { ICourse } from '../models/course';
import { ISubject, Subject } from '../models/subject';


@Injectable()
export class CourseService {
  private course$: FirebaseListObservable<ICourse[]>;
  private subjects$: Observable<ISubject[]>;
  private readonly COURSES = '/courses';
  private readonly SUBJECTS = '/subjects';

  constructor(private af: AngularFire) {

  }
  // this needs to be a query, based upon 
  getAllCourses(): FirebaseListObservable<ICourse[]> {
    this.course$ = this.af.database.list(this.COURSES);
    return this.course$;
 }

  getCourses(subject: string): FirebaseListObservable<ICourse[]> {
    this.course$ = this.af.database.list(this.COURSES, { 
       query: {
        orderByChild: 'subject',
        equalTo: subject 
      }});

  return this.course$;
  }

  getSubjects(): Observable<ISubject[]> {
    //this.subjects$.every;
    this.subjects$ = this.af.database.list(this.SUBJECTS)
    .map((subjects) => { return subjects.map((subject)=> {
      //console.log(subject)
      return new Subject(subject);
    })});
    return this.subjects$;
  }

  private populateDB() {
    let subs = [];
    let subjects = this.af.database.list(this.SUBJECTS);

    this.course$.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        let course = (<any>snapshot).val();
        if (subs.indexOf(course.subject) == -1) {
          subs.push(course.subject);
          subjects.push(course.subject);
        }
      });
    });
  }
}