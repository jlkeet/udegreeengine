import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth';
import { EngineRoutingModule } from './engine-routing';

import {TestComponent} from './components/engine.component';
import {CourseListComponent} from './components/course-list.component';
import { ErrorListComponent }from './components/error-list.component';
import {EngineService} from './services/engine.service';
import  {InitService } from './services/ini.service';
import  {TotalPointsComponent } from './components/total-points.component';
import { SemesterCourseListComponent } from './components/semester-course-list';
import { ICourse } from './models/course';
import { ISubject, Subject } from './models/subject';
import { Rule, IRule, Result } from './models/rule';
import { IFaculty, Faculty } from './models/faculty';



@NgModule({
  declarations: [
    TestComponent,
    CourseListComponent,
    ErrorListComponent,
    TotalPointsComponent,
    SemesterCourseListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EngineRoutingModule
  ],
  providers: [
    EngineService,
    InitService
  ]
})

export class EngineModule {}
export { Rule, IRule } 

