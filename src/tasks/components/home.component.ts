import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/first';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CourseService } from '../services/course-service';
import { ICourse } from '../models/course';
import { ISubject } from '../models/subject';
import { Result } from '../models/rule';
import { IFaculty, Faculty } from '../models/faculty';

//TODO filter courses by  level / subject

@Component({
  selector: 'home',
  styles: [
    require('./home.scss')
  ],
  template: require('./home.html')
})
export class HomeComponent {
  courses$: FirebaseListObservable<ICourse[]>;
  subjects$: Observable<ISubject[]>;
  faculties$: Observable<IFaculty[]>;
  form: FormGroup;
  loading: boolean = false;
  levels: any[];
  selectedCourses: ICourse[] =[];

private results: Result[];
  private totalPoints: number = 0;
  private courseAdded$: ReplaySubject<any> = new ReplaySubject();
  private couseRemoved$: ReplaySubject<any> = new ReplaySubject();
  private allCourses$: Observable<ICourse[]>;
  private allCourses: ICourse[];
  private filteredCourses: ICourse[];
  private subjectSelected$: ReplaySubject<any> = new ReplaySubject();
  private levelSelected$: ReplaySubject<any> = new ReplaySubject();
  private filteredCourses$: Observable<any>;
  private lastFormValue: any;

  private chosenLevel = undefined;
  private chosenSubject = undefined;
  private chosenFaculty: IFaculty = undefined;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    let component = this;

    // set up observables
    this.allCourses$ = this.courseService.getCourses()
    .do( (courses) => {
      debugger;
    });
   // let filteredByLevel$ = this.levelSelected$.switchMap(level => this.filterCourses(level, undefined));
   // let filteredBySubject$ = this.subjectSelected$.switchMap(subject => this.filterCourses(undefined, subject));
   // this.filteredCourses$ = Observable.merge(filteredByLevel$, filteredBySubject$);
  

    // get data for dropdowns
    this.levels = this.getLevels();
    this.subjects$ = this.courseService.getSubjects();
    this.faculties$ = this.courseService.getFaculties();
    this.lastFormValue = {}

    // create form    
    this.form = this.fb.group({
      faculty: [null, Validators.required],
      subject: [null, Validators.required],
      level: [null, Validators.required],
      course: [null, Validators.required]
    });

    // fire observables when dropdowns change
    this.form.valueChanges.subscribe(data => {
    if (component.lastFormValue.faculty !=  data.faculty) {
      component.chosenFaculty = data.faculty;
    
      console.log("faculty Set");

      this.courseService.setFaculty(this.chosenFaculty);
    }
    if (component.lastFormValue.level != data.level) {
      component.chosenLevel = data.level;
        console.log("level Set");
    }
    if (component.lastFormValue.subject != data.subject) {
      component.chosenSubject = data.subject;
        console.log("subject Set");
    }

    component.lastFormValue = data;
    //  component.chosenFaculty != undefined ? component.form.get('subject').enable(): component.form.get('subject').disable();
    //  component.chosenSubject != undefined ? component.form.get('level').enable(): component.form.get('level').disable();
    //  component.chosenLevel != undefined ? component.form.get('course').enable(): component.form.get('course').disable();


  ;
       
  if ( component.chosenFaculty && component.chosenLevel && component.chosenSubject ) {
    component.filteredCourses = component.filterCourses( component.chosenFaculty, component.chosenLevel,component.chosenSubject );
  }
  else {
    component.filteredCourses=[];
  }

      

    });

    this.courseAdded$.subscribe((course) => {

      let idx = this.selectedCourses.findIndex( c => { return c.$key === course.$key });
      if(idx < 0)
      {
        this.selectedCourses.push(course);
        this.totalPoints += course.credits;
        this.results = this.courseService.checkRules(this.selectedCourses);
      }
      
    });

    this.couseRemoved$.subscribe((key) => {

    let idx = this.selectedCourses.findIndex( c => { return c.$key === key });
    let removed = this.selectedCourses.splice(idx,1)[0];
       this.totalPoints -= <any>removed.credits;
       this.results = this.courseService.checkRules(this.selectedCourses);
    });    
  }

  public trackCourse(index, course) {
        return course ? course.code : undefined;

    }


    public trackSubject(index, subject)
    {
      return subject ? subject.subject : undefined;
    }

  public addCourse()
  {
    let course = this.form.controls['course'].value;
    this.courseAdded$.next(course);

  }
  public removeCourse(key:string)
  {
    this.couseRemoved$.next(key);

  }

  private getLevels(): any[] {
    return [
      { id: 1, name: 'Level One' },
      { id: 2, name: 'Level Two' },
      { id: 3, name: 'Level Three' }
    ]
  }



  // Course dropdowns have changed - update courses user can choose from
  private filterCourses(faculty: any, level: any, subject: any) {
    let component = this;
    this.loading = true
       console.log("filterin courses");
  
       

       let byFaculty = this.allCourses.filter(course => {
          return course.faculty === component.chosenFaculty.name;
        });

        let bySubject = byFaculty.filter(course => {
          return course.subject === component.chosenSubject;
        });
        let filteredCourses = bySubject.filter(course => {
          return course.level === component.chosenLevel.id;
        });

        component.loading = false;
           return filteredCourses;

    }
    // else if (level != undefined) {
    //   this.chosenLevel = level;
    //   let byLevel$ = this.allCourses$
    //     .map(courses => courses.filter(course => {
    //       return course.level === component.chosenLevel.id;
    //     }));

    //     return byLevel$.map(courses => courses.filter(course => {
    //       return course.subject === component.chosenSubject;
    //     }));
    // }
    // else if (subject != undefined) {
    //   this.chosenSubject = subject;

    //   let bySubject$ = this.allCourses$
    //     .map(courses => courses.filter(course => {
    //       return course.subject === component.chosenSubject;
    //     }));

    //   return bySubject$
    //     .map(courses => courses.filter(course => {
    //       return course.level === component.chosenLevel.id;
    //     }))
    //     .do(() => component.loading = false);

    //}


}
