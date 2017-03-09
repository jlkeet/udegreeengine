import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { TestService } from '../services/test.service';
import { ICourse, Course } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';

//http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

@Component({
  selector: 'test',
  styles: [`
  label { 
    min-width: 100px!important;
    display: inline-block;
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
  selectedCourses$: Observable<ICourse[]>;

  levels: any[];

  constructor(private fb: FormBuilder, private testService: TestService) {

    this.form = this.fb.group({
      faculty: [null, Validators.required],
      subject: [null, Validators.required],
      course: [null, Validators.required],
      level: [null, Validators.required]
    });

    let component = this;
    this.form.valueChanges.subscribe(data => {
      if (component.lastFormValue.faculty != data.faculty) {
        console.log("faculty Set");
        //for Arts it takes 5 seconds to run this query (index on faculty)
        this.testService.setFaculty(data.faculty);
      }
      if (component.lastFormValue.subject != data.subject) {
        console.log("subject Set");
        this.testService.setSubject(data.subject);
      }
      if (component.lastFormValue.level != data.level) {
        console.log("level Set");
        this.testService.setLevel(data.level);
      }
    });

    this.levels = this.testService.getLevels();

    this.faculties$ = this.testService.getFaculties();

    this.subjects$ = this.testService.getsSubjects();

    this.allCourses$ = this.testService.getCourses();

    this.selectedCourses$ = this.testService.courses$;


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
