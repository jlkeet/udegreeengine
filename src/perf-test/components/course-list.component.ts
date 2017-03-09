import { Component , Input, SimpleChanges, OnChanges, OnInit, } from '@angular/core';
import  { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TestService } from '../services/test.service';
import { ICourse } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';

@Component({
  selector: 'course-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [ `
  `],
  template: `
    <h3>Courses - {{totalPoints}} pts</h3>
    <ul class="courses">
        <li *ngFor="let c of selectedCourseList;  trackBy: trackCourse">
        <span>{{c.title}} [ {{c.code}}]</span>
        <button (click)="removeCourse(c.$key)">X</button> </li>
    </ul>
  `
})

export class CourseListComponent implements OnChanges, OnInit {
  @Input() selectedCourses: Observable<ICourse>;
  totalPoints: number = 0;
  selectedCourseCount: number = 0;
  selectedCourseList: ICourse[] = [];


  constructor(private cd: ChangeDetectorRef) {
      let component = this;
  }

  trackCourse(index, course) {
    return course ? course.code : undefined;
  }

  removeCourse(key: any) {
      alert('will remove');
  }

   ngOnInit() {
       let component = this;
    this.selectedCourses.subscribe((data) => {
      this.selectedCourseList.push(data);
      component.totalPoints += parseInt(data.credits); // application state changed
      component.cd.markForCheck();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
       this.totalPoints = 0;
  }
}
