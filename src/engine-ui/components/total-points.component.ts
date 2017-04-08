import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EngineService } from '../../engine';
import { ICourse } from '../../engine';

@Component({
  selector: 'total-points',
  styles: [],
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
        //todo why error?
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

      /*
          this.courses
      // each time course list changes, calculate the new total points count
      .map(course => { return  course.credits})
      .scan((totalPoints: number, points:number) => {
        totalPoints = 0;
        //todo why error?
        debugger;

         totalPoints += points;
         console.log(`totalPoints =${totalPoints}`)
        return totalPoints;
      },
      0)
      .subscribe((totalPoints) => {
        this.totalPoints = totalPoints;
      });*/
  }
}
