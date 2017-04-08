import { Component, Input  } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EngineService } from '../../engine';
import { Result} from '../../engine';

//component to display supplied errors
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

export class ErrorListComponent {
  @Input() errors: Observable<Result>;

  constructor(private cd: ChangeDetectorRef) {  }
}
