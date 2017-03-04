import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CourseService } from '../services/course-service';
import { ICourse } from '../models/course';
import { ISubject } from '../models/subject';

//TODO filter courses by  level / subject

@Component({
  selector: 'home',
  styles: [
    require('./home.scss')
  ],
  template: `
      <div class="g-row">
      <div class="g-col">
  <h3>Choose Course To Add</h3>
  <form [formGroup]="form" >
  <div class="mdl-selectfield">
    <label for="level">Level</label>
    <select name="level" formControlName="level">
          <option [selected]="form.controls['level'].value == null" value="">-- Select --</option>
        <option *ngFor="let level of levels" [ngValue]="level">  
            {{level.name}}
        </option>
    </select>

    </div>   
  <div class="mdl-selectfield">
    <label for="subject">Subject</label>
    <select name="subject" formControlName="subject">
          <option [selected]="form.controls['subject'].value == null" value="">-- Select --</option>
        <option *ngFor="let subject of subjects$ |async" [ngValue]="subject.subject">  
            {{subject.subject}}
        </option>
    </select>

    </div> 

    </form>
          <div class="mdl-selectfield">
          <div *ngIf="loading">
            <span>Refreshing Course List</span>
          </div>
          <label *ngIf="!loading" for="course">Course</label>
   
    <select name="course" [ngClass]="{'hidden': loading}">
          <option value="">-- Select --</option>
        <option *ngFor="let course of filteredCourses$ |async" [ngValue]="course.title">  
            {{course.title}}
        </option>
    </select>

    </div>   
     </div>   
      </div>   
  `
})
export class HomeComponent {
  courses$: FirebaseListObservable<ICourse[]>;
  subjects$: Observable<ISubject[]>;
  form: FormGroup;
  loading: boolean = false;
  levels: any[];

  private allCourses$: FirebaseListObservable<ICourse[]>;
  private subjectSelected$: ReplaySubject<any> = new ReplaySubject();
  private levelSelected$: ReplaySubject<any> = new ReplaySubject();
  private filteredCourses$: Observable<any>;

  constructor(private fb: FormBuilder, private courseService: CourseService) {

     this.levels = this.getLevels();

    // we should start with default value?
      this.form = this.fb.group({
        level: [this.levels[0], Validators.required],
        subject: [null, Validators.required]
      });

     this.subjects$ = this.courseService.getSubjects();
     
      this.subjects$.first().subscribe(subjects => {
        this.form.controls['subject'].setValue(subjects[0].subject);
      });


   
   
    this.allCourses$ = this.courseService.getAllCourses();

    // here we set the requests that are actually displayed.
    // if the filter is null, we take all requests, else we show the filtered.

    let filteredByLevel$ = this.levelSelected$.switchMap(level => this.filterCourses(level, undefined));
    let filteredBySubject$ = this.subjectSelected$.switchMap(subject => this.filterCourses(undefined, subject));

    this.filteredCourses$ = Observable.merge(filteredByLevel$,filteredBySubject$);
    
    

    //start with show all false
    this.levelSelected$.next(this.levels[0]);
    this.subjectSelected$.next('ANCHIST');

    this.form.valueChanges.subscribe(data => {
      console.log('Form changes', data)
      if (data.subject) {
        this.subjectSelected$.next(data.subject);
      }
      else {
        this.levelSelected$.next(data.level);
      }

    })
  }

  private getLevels(): any[] {
    return [
      { id: 1, name: 'Level One' },
      { id: 2, name: 'Level Two' },
      { id: 3, name: 'Level Three' }
    ]
  }

  private updateCourseList(subject: string) {
    this.courses$ = this.courseService.getCourses(subject);
  }

  private chosenLevel = undefined;
  private chosenSubject = undefined;
  private filterCourses(level: any, subject: any)
  {
    let component = this;
    this.loading = true
    console.log("filtering");
    if(level != undefined)
    {
      this.chosenLevel = level;
    }
    if(subject != undefined)
    {
      this.chosenSubject = subject;
    }    
    if(component.chosenLevel && component.chosenSubject)
    {
       let bySubject$ = this.allCourses$
          .map(courses => courses.filter(course => { 
            return course.subject ===  component.chosenSubject;
          }));

        return bySubject$
               .map(courses => courses.filter(course => { 
            return course.level ===  component.chosenLevel.id;
          }))
          .do(() => component.loading = false);

   }
   else {
     return [];
   }

    // return this.allCourses$
    //       .map(courses => courses.filter(course => {
    //         if(component.chosenLevel && !component.chosenSubject)
    //         {
    //             return course.level === component.chosenLevel.id;
    //         }
    //         else if(!component.chosenLevel && component.chosenSubject)
    //         {
    //         return course.subject === component.chosenSubject;
    //         }
    //         else{
    //           let byCourses = 
    //           return course.level === component.chosenLevel.id && course.subject === component.chosenSubject;
    //         }
    //       }));

        
  }
}


/*
    this.filteredCourses$ = this.level$
      //when the filter observable fires (when switch changed)
      .switchMap(level => {
        //if filter is true 
        return this.allCourses$
          .map(courses => courses.filter(course => {
            return course.level === level.id;
          }));
      });
      */