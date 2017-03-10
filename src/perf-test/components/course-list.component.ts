import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TestService } from '../services/test.service';
import { ICourse } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';

@Component({
  selector: 'course-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  `],
  template: `
    <h3>Courses - {{totalPoints}} pts</h3>
    <ul class="courses">
        <li *ngFor="let c of selectedCourses |async;  trackBy: trackCourse">
        <span>{{c.title}} [ {{c.code}}]</span>
        <button (click)="removeCourse(c)">X</button> </li>
    </ul>
  `
})

export class CourseListComponent implements OnInit {
  @Input() selectedCourses: Observable<ICourse>;
  @Output() onRemoveCourse = new EventEmitter();
  totalPoints: number = 0;

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
    this.selectedCourses
      // each time course list changes, calculate the new total points count
      .scan((totalPoints: number, courses) => {
        totalPoints = 0;
        //todo why error?
        courses.forEach(c => {
            totalPoints += parseInt(c.credits);
        })
        return totalPoints;
      },
      0)
      .subscribe((totalPoints) => {
        this.totalPoints = totalPoints;
      });
  }
}
