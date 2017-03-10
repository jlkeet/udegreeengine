import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { TestService } from '../services/test.service';
import { InitService } from '../services/ini.service';
import { ICourse, Course } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';
import { Result } from '../models/rule';

//http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

@Component({
  selector: 'test',
  styles: [`
  .container { display: flex;  }
  .column { margin: 5px; padding: 5px; border: 1px solid #999; display: flex; flex: 1; flex-direction: column; max-width:49%;}
  label { 
    min-width: 100px!important;
    display: inline-block;
  }
  form { position:relative; }
  .loading-shield {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background: rebeccapurple;
    justify-content: center;
    align-items: center;
    opacity: 0.9;
  }
  select { min-width: 250px;}
  .hideoption { display:none; visibility:hidden; height:0; font-size:0; }
  `],
  template: require('./test.component.html')
})

export class TestComponent {
  form: FormGroup;
  lastFormValue: any = {};
  allCourses$: Observable<ICourse[]>;
  faculties$: Observable<IFaculty[]>;
  subjects$: Observable<ISubject[]>;
  errors$: Observable<Result[]>;
  selectedCourses$: Observable<ICourse[]>;
  loading: boolean = true;
  levels: any[];

  constructor(private fb: FormBuilder, private testService: TestService, private initService: InitService) {

    this.form = this.fb.group({
      faculty: [null, Validators.required],
      subject: [null, Validators.required],
      course: [null, Validators.required],
      level: [null, Validators.required]
    });

    let component = this;
    this.form.valueChanges.subscribe(data => {
      if (component.lastFormValue.faculty != data.faculty) {
        this.loading = true;
        this.testService.setFaculty(data.faculty);
      }
      if (component.lastFormValue.subject != data.subject) {
        this.testService.setSubject(data.subject);
      }
      if (component.lastFormValue.level != data.level) {
        this.testService.setLevel(data.level);
      }
      component.lastFormValue = data;
    });

    this.levels = this.testService.getLevels();

    this.faculties$ = this.testService.getFaculties().do( () => {
      this.loading = false;
    });;;

    this.subjects$ = this.testService.getsSubjects().do( () => {
      this.loading = false;
    });;

    this.allCourses$ = this.testService.getCourses();

    this.selectedCourses$ = this.testService.selectedCourses$;

    this.errors$ = this.testService.errors$;


  }

  public addCourse() {
     let course = this.form.controls['course'].value;
     this.testService.addCourse(new Course(course));
  }

  public removeCourse(course: ICourse)
  {
      this.testService.removeCourse(course);
  }

  public trackSubject(index, subject) {
    return subject ? subject.name : undefined;
  }
  public trackCourse(index, course) {
    return course ? course.code : undefined;
  }
}
