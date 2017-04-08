import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICourse } from '../../engine';

@Component({
  selector: 'total-points',
  template: `
    <label>{{title}}: {{totalPoints}} pts</label>
  `
})

export class TotalPointsComponent implements OnInit {
  @Input() courses: Observable<ICourse[]>;
  @Input() title: string;
  private totalPoints: number;
  constructor() {  }

  ngOnInit() {
    this.courses
      // each time course list changes, calculate the new total points count
      .scan((totalPoints: number, courses) => {
        totalPoints = 0;
        courses.forEach(c => {
            totalPoints += c.credits;
        })
        return totalPoints;
      },
      0)
      .subscribe((totalPoints) => {
        console.log(`totalPoints = ${totalPoints}`);
        this.totalPoints = totalPoints;
      });
  }
}
