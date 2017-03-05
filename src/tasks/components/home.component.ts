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
import { Result } from '../models/rule';

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

private results: Result[];
  private totalPoints: number = 0;
  private courseAdded$: ReplaySubject<any> = new ReplaySubject();
  private couseRemoved$: ReplaySubject<any> = new ReplaySubject();
  private allCourses$: FirebaseListObservable<ICourse[]>;
  private subjectSelected$: ReplaySubject<any> = new ReplaySubject();
  private levelSelected$: ReplaySubject<any> = new ReplaySubject();
  private filteredCourses$: Observable<any>;
  private lastFormValue: any;

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

    this.lastFormValue = {subject: 'ARCHDES', level: this.levels[0] }

    // create form    
    this.form = this.fb.group({
      level: [this.levels[0], Validators.required],
      subject: ['ARCHDES', Validators.required],
      course: [null, Validators.required]
    });

    // update form subject
    // this.subjects$.first().subscribe(subjects => {
    //   this.form.controls['subject'].setValue(subjects[0].subject);
    // });

    // initiailse dropdowns
    this.levelSelected$.next(this.levels[0]);
    this.subjectSelected$.next('ARCHDES');

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

  private chosenLevel = undefined;
  private chosenSubject = undefined;
  // Course dropdowns have changed - update courses user can choose from
  private filterCourses(level: any, subject: any) {
    let component = this;
    this.loading = true
    console.log("filtering");
    if (level != undefined) {
      this.chosenLevel = level;
      let byLevel$ = this.allCourses$
        .map(courses => courses.filter(course => {
          return course.level === component.chosenLevel.id;
        }));

        return byLevel$.map(courses => courses.filter(course => {
          return course.subject === component.chosenSubject;
        }));
    }
    else if (subject != undefined) {
      this.chosenSubject = subject;

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
