import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { TestService } from '../services/test.service';
import { ICourse } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';

@Component({
  selector: 'test',
  styles: [ `
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

   levels: any[];

  constructor(private fb: FormBuilder,private testService: TestService) {

   this.form = this.fb.group({
      faculty: [null, Validators.required],
      subject: [null, Validators.required],
      course: [null, Validators.required],
      level: [null, Validators.required]
    });
  
  let component = this;
  this.form.valueChanges.subscribe(data => {
      if (component.lastFormValue.faculty !=  data.faculty) {
        console.log("faculty Set");
        //for Arts it takes 5 seconds to run this query (index on faculty)
        this.testService.setFaculty(data.faculty);
      }
      if (component.lastFormValue.subject !=  data.subject) {
        console.log("subject Set");
        this.testService.setSubject(data.subject);
      }     
      if (component.lastFormValue.level !=  data.level) {
        console.log("level Set");
        this.testService.setLevel(data.level);
      }          
  });

  this.levels = this.testService.getLevels();

   this.faculties$ = this.testService.getFaculties()
      .debug();
   this.subjects$ = this.testService.getsSubjects()
      .debug();
   this.allCourses$ = this.testService.getCourses()
   .debug();

  }
}
