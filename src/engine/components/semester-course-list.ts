import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICourse } from '../models/course';

@Component({
  selector: 'semester-course-list',
  styles: [`
  .header { display: flex; justify-content: space-between;}
  ul li { list-style: none; font-size: 11px; color: green; }
  `],
  template: `
    <div class="header">
    <label>{{title}}</label>
    <total-points [courses]="semesterCourses" [title]="'Points'"></total-points>
    </div>
    <ul class="courses">
        <li *ngFor="let c of semesterCourses|async;  trackBy: trackCourse">
        <span>{{c.title}} [ {{c.code}}]</span>
        <button (click)="removeCourse(c)">X</button> </li>
    </ul>
  `
})

export class SemesterCourseListComponent implements OnInit {
  
  @Input() courses:  Observable<ICourse[]>;
  @Input() semester: number;
  @Input() title: string;
  @Output() onRemoveCourse = new EventEmitter();
  
  private semesterCourses:Observable<ICourse[]>;

  constructor() { }

  trackCourse(index, course) {
    return course ? course.code : undefined;
  }

  removeCourse(course: ICourse) {
    this.onRemoveCourse.emit(course);
  }

  ngOnInit() {
      this.semesterCourses = this.courses
      .map( courses => courses.filter(c => c.semester === this.semester));
  }
}
