import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { EngineService } from '../../engine';
import { ICourse, Course, IFaculty, ISubject } from '../../engine';

@Component({
  selector: 'course-select-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`  
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
  button {
          background-color: green;
    color: white;
    border: green;
    padding: 3px 8px;
  }
  button:hover {
      background-color: darkgreen;
  }
  select { min-width: 250px;}
  .hideoption { display:none; visibility:hidden; height:0; font-size:0; }`],
  template: require('./course-select-form.html')
})

export class CourseSelectFormComponent implements OnInit {
  
  @Output() onCourseAdded = new EventEmitter<ICourse>();
  @Output() onCourseRemoved = new EventEmitter<ICourse>();

  private form: FormGroup;
  private lastFormValue: any = {};
  private loading: boolean = true;
  
  private levels: any[];
  private semesters: any[];
  private faculties$: Observable<IFaculty[]>;
  private subjects$: Observable<ISubject[]>;
  private allCourses$: Observable<ICourse[]>;

  constructor(private fb: FormBuilder, private EngineService: EngineService) {  }

  public addCourse() {
     let course = this.form.controls['course'].value;
     let semester = this.form.controls['semester'].value;
     let courseModel  = new Course(course);
     courseModel.semester = semester;
     this.onCourseAdded.emit(courseModel);
  }

  public removeCourse(course: ICourse){
    this.onCourseRemoved.emit(course);
  }

  public trackSubject(index, subject) {
    return subject ? subject.name : undefined;
  }
  public trackCourse(index, course) {
    return course ? course.code : undefined;
  }

  ngOnInit() {

      this.createForm();
    this.levels = this.EngineService.getLevels();
    this.semesters = this.EngineService.getSemesters();

    this.faculties$ = this.EngineService.getFaculties().do( () => {
      this.loading = false;
    });

    this.subjects$ = this.EngineService.getsSubjects().do( () => {
      this.loading = false;
    });

      let component = this;
   this.form.valueChanges.subscribe(data => {
      if (component.lastFormValue.faculty != data.faculty) {
        this.loading = true;
        this.EngineService.setFaculty(data.faculty);
      }
      if (component.lastFormValue.subject != data.subject) {
        this.EngineService.setSubject(data.subject);
      }
      if (component.lastFormValue.level != data.level) {
        this.EngineService.setLevel(data.level);
      }
      component.lastFormValue = data;
    });

    this.allCourses$ = this.EngineService.getCourses();
  }

  private createForm()
  {
          this.form = this.fb.group({
      faculty: [null, Validators.required],
      subject: [null, Validators.required],
      course: [null, Validators.required],
      level: [null, Validators.required],
      semester: [null, Validators.required]
    });
  }
}
