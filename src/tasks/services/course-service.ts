import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuthState, } from 'angularfire2';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/every';
import { ICourse } from '../models/course';
import { ISubject, Subject } from '../models/subject';
import {  Rule, Result } from '../models/rule';
import {  IFaculty, Faculty } from '../models/faculty';


@Injectable()
export class CourseService {
  private course$: FirebaseListObservable<ICourse[]>;
  private subjects$: Observable<ISubject[]>;
  private faculties$: Observable<IFaculty[]>;
  private readonly COURSES = '/courses';
  private readonly SUBJECTS = '/subjects';
  private readonly FACULTIES = 'faculties';
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
    .map((subjects) => { 
      //debugger;
      subjects.sort(function(a, b){
          if(a.$value < b.$value) return -1;
          if(a.$value > b.$value) return 1;
          return 0;
      });
      return subjects.map((subject)=> {
      //console.log(subject)
      return new Subject(subject);
    })});
    return this.subjects$;
  }

    getFaculties(): Observable<IFaculty[]> {
    //this.subjects$.every;
    this.faculties$ = this.af.database.list(this.FACULTIES)
    .map((faculties) => { 
      //debugger;
      faculties.sort(function(a, b){
          if(a.$value < b.$value) return -1;
          if(a.$value > b.$value) return 1;
          return 0;
      });
      return faculties.map((faculty)=> {
      //console.log(subject)
      return new Faculty(faculty);
    })});
    return this.faculties$;
  }

  getRules()
  {
    // Get the rules for current degree only
    // 1) must have All from this group
    // 2) must have at least ONE from this group
    //'ARCHDES 100', 'ARCHDRC 102', 'ARCHTECH 106', 'ARCHDES 101', 'ARCHHTC 102', 'ARCHTECH 107'
    return  [
      new Rule(1, [ 'ARCHDES 100',  'ARCHDES 101' ]),
      new Rule(1, [ 'ARCHDES 200', 'ARCHDRC 202', 'ARCHTECH 207', 'ARCHHTC 235', 'ARCHDES 201', 'ARCHTECH 208', 'ARCHHTC 236']),
      new Rule(1, [ 'ARCHDES 300', 'ARCHHTC 340', 'ARCHTECH 307', 'ARCHDES 301', 'ARCHHTC 339', 'ARCHTECH 312', 'ARCHPRM 304']),
      new Rule(2, [ 'ARCHDRC 300','ARCHDRC 301','ARCHDRC 302','ARCHDRC 303','ARCHDRC 304','ARCHDRC 370','ARCHDRC 371','ARCHDRC 372','ARCHDRC 373'])
    ];
  }

  checkRules(courses :ICourse[]) {
     //check list of selected courses against all Rules
     // A rule needs to return TRUE/ FALSE and if false an error message(s)
     let results:  Result[] = [];
     let rules = this.getRules();
     rules.forEach((rule) => {
        // each rule type is evaluated differently
        switch(rule.type)
        {
            case 1:
             results.push(this.evaulateRuleTypeOne(courses, rule.courses));

            case 2:
             results.push(this.evaulateRuleTypeTwo(courses, rule.courses));
        }
     });
     return results;
  }

  private evaulateRuleTypeOne(courses:ICourse[], required:string[]) : Result
  {
    // for this rule type, courses must have ALL courses from required
    let missing = required.filter( function( req_code ) {
      return !courses.find( (c) => { return c.code == req_code }); 
    });
    if(missing.length > 0)
    {
       return new Result(['must select all> ' + required.toString()]);
    }
    return new Result([]);
  }

  private evaulateRuleTypeTwo(courses:ICourse[], required:string[]) : Result
  {
    // for this rule type, courses must have at least one course from required
    let found = required.filter( function( req_code ) {
      return courses.find( (c) => { return c.code == req_code });
    });
    if(found.length === 0)
    {
       return new Result(['must select one from ' + required.toString()]);
    }
    return new Result([]);
  }

  private populateSubjects() {
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

  private populateFaculties() {
    //use this to generate list of faculties from courses
    //call from getAllCourses
        let facs = [];
        debugger;
        let faculties = this.af.database.list(this.FACULTIES);

        this.course$.subscribe(snapshots => {
              snapshots.forEach(snapshot => {
                let course = (<any>snapshot);
                if (facs.indexOf(course.faculty) == -1) {
                  facs.push(course.faculty);
                  faculties.push(course.faculty);
                }
              });
    });        
  }
}