import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject as Subject } from 'rxjs/Subject';

import { EngineService } from '../services/engine.service';
import { ICourse } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';

@Component({
  selector: 'course-list',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  ul li { list-style: none; font-size: 11px; }
  `],
  template: `
    <h3>Courses</h3>
    <label>Semester One</label>
    <ul class="courses">
        <li *ngFor="let c of semesterOneCourses|async;  trackBy: trackCourse">
        <span>{{c.title}} [ {{c.code}}]</span>
        <button (click)="removeCourse(c)">X</button> </li>
    </ul>
    <label>Semester Two</label>
    <ul class="courses">
        <li *ngFor="let c of semesterTwoCourses |async;  trackBy: trackCourse">
        <span>{{c.title}} [ {{c.code}}]</span>
        <button (click)="removeCourse(c)">X</button> </li>
    </ul>
    <label>Semester Three</label>
    <ul class="courses">
        <li *ngFor="let c of semesterThreeCourses |async;  trackBy: trackCourse">
        <span>{{c.title}} [ {{c.code}}]</span>
        <button (click)="removeCourse(c)">X</button> </li>
    </ul>  
    <label>All</label>
    <ul class="courses">
        <li *ngFor="let c of selectedCourses | async;">
        <span>{{c.title}} [ {{c.code}}]</span>
    </ul>              
  `
})

export class CourseListComponent implements OnInit {
  
  @Input() inputCourses:  Observable<ICourse[]>;
  @Output() onRemoveCourse = new EventEmitter();
  
  private selectedCourses: Observable<ICourse[]>;
  private semesterOneCourses:Observable<ICourse[]>;
  private semesterTwoCourses: Observable<ICourse[]>;
  private semesterThreeCourses: Observable<ICourse[]>;

  constructor(private cd: ChangeDetectorRef) {
    let component = this;
  }

  trackCourse(index, course) {
    return course ? course.code : undefined;
  }

  removeCourse(course: ICourse) {
    this.onRemoveCourse.emit(course);
  }

  ngOnInit() {
    this.selectedCourses = this.inputCourses;
    //     .map(x => {
    // console.log(x.length);
    //   this.courses = x;
    //   return x;
    // }
    //   );

      this.semesterOneCourses = this.inputCourses
      .map( courses => courses.filter(c => c.semester === 1));

      this.semesterTwoCourses = this.inputCourses
      .map( courses => courses.filter(c => c.semester === 2));

      this.semesterThreeCourses = this.inputCourses
      .map( courses => courses.filter(c => c.semester === 3));
      //or we can use the service direct
  //  this.selectedCourses =  this.engineService.selectedCourses$
  //   .map(x => {
  //   console.log(x.length);
  //     this.courses = x;
  //     return x;
  //   }
  //     );



     
  }
}
