import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { EngineService, InitService } from '../../engine';
import { ICourse, IFaculty, ISubject, Result} from '../../engine';

//http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

@Component({
  selector: 'test',
  styles: [`
  .container { display: flex;  }
  .column {  display: flex; flex: 1; flex-direction: column;}
  .column-third {max-width:33%; }
  .row { width: 100%; display: flex; }
  .box { margin: 5px; padding: 5px; border: 1px solid #999; } 

  `],
  template: require('./engine.component.html')
})

export class TestComponent {


 private selectedCourses$: Observable<ICourse[]>; 
 private errors$: Observable<Result[]>;


  constructor( private EngineService: EngineService, private initService: InitService) {

    this.selectedCourses$ = this.EngineService.selectedCourses$;
    this.errors$ = this.EngineService.errors$;
  }

  public addCourse(course: ICourse)
  {
      this.EngineService.addCourse(course);
  }

  public removeCourse(course: ICourse)
  {
      this.EngineService.removeCourse(course);
  }


}
