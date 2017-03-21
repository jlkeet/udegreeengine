import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EngineService } from '../services/engine.service';
import { ICourse } from '../models/course';
import { IFaculty } from '../models/faculty';
import { ISubject } from '../models/subject';

@Component({
  selector: 'error-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`ul li { list-style: none; font-size: 11px; }
  `],
  template: `
    <h3>Errors</h3>
    <ul class="errors">
        <li *ngFor="let e of errors |async;  trackBy: trackError">
        <span>{{e.errors}}</span>
    </ul>
  `
})

export class ErrorListComponent implements OnInit {
  @Input() errors: Observable<ICourse>;

  constructor(private cd: ChangeDetectorRef) {  }

  trackCourse(index, course) {
    return course ? course.code : undefined;
  }

  ngOnInit() {
    // this.selectedCourses
    //   // each time course list changes, calculate the new total points count
    //   .scan((totalPoints: number, courses) => {
    //     totalPoints = 0;
    //     //todo why error?
    //     courses.forEach(c => {
    //         totalPoints += parseInt(c.credits);
    //     })
    //     return totalPoints;
    //   },
    //   0)
    //   .subscribe((totalPoints) => {
    //     this.totalPoints = totalPoints;
    //   });
  }
}
