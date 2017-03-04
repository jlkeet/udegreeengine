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
  template: require('./home.html')
})
export class HomeComponent {
  courses$: FirebaseListObservable<ICourse[]>;
  subjects$: Observable<ISubject[]>;
  form: FormGroup;
  loading: boolean = false;
  levels: any[];
  selectedCourses: ICourse[] =[];

  private allCourses$: FirebaseListObservable<ICourse[]>;
  private subjectSelected$: ReplaySubject<any> = new ReplaySubject();
  private levelSelected$: ReplaySubject<any> = new ReplaySubject();
  private filteredCourses$: Observable<any>;
  private lastFormValue: any = {subject: undefined, level: undefined };

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    let component = this;

    // set up observables
    this.allCourses$ = this.courseService.getAllCourses();
    let filteredByLevel$ = this.levelSelected$.switchMap(level => this.filterCourses(level, undefined));
    let filteredBySubject$ = this.subjectSelected$.switchMap(subject => this.filterCourses(undefined, subject));
    this.filteredCourses$ = Observable.merge(filteredByLevel$, filteredBySubject$);

    // get data for dropdowns
    this.levels = this.getLevels();
    this.subjects$ = this.courseService.getSubjects();

    // create form    
    this.form = this.fb.group({
      level: [this.levels[0], Validators.required],
      subject: [null, Validators.required],
      course: [null, Validators.required]
    });

    // update form subject
    this.subjects$.first().subscribe(subjects => {
      this.form.controls['subject'].setValue(subjects[0].subject);
    });

    // initiailse dropdowns
    this.levelSelected$.next(this.levels[0]);
    this.subjectSelected$.next('ANCHIST');

    // fire observables when dropdowns change
    this.form.valueChanges.subscribe(data => {
      //console.log('Form changes', data)
      if (component.lastFormValue.subject != data.subject) {
        this.subjectSelected$.next(data.subject);
      }
      else if(component.lastFormValue.level != data.level) {
        this.levelSelected$.next(data.level);
      }

      this.lastFormValue = data;

    })
  }

  public addCourse()
  {
    this.selectedCourses.push(this.form.controls['course'].value);
  }
  public removeCourse(key:string)
  {
    let idx = this.selectedCourses.findIndex( c => { return c.$key === key });
    this.selectedCourses.splice(idx,1);
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
  private filterCourses(level: any, subject: any) {
    let component = this;
    this.loading = true
    console.log("filtering");
    if (level != undefined) {
      this.chosenLevel = level;
    }
    if (subject != undefined) {
      this.chosenSubject = subject;
    }
    if (component.chosenLevel && component.chosenSubject) {
      let bySubject$ = this.allCourses$
        .map(courses => courses.filter(course => {
          return course.subject === component.chosenSubject;
        }));

      return bySubject$
        .map(courses => courses.filter(course => {
          return course.level === component.chosenLevel.id;
        }))
        .do(() => component.loading = false);

    }
    else {
      return [];
    }
  }
}
