import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth';
import { EngineRoutingModule } from './engine-routing';

import {TestComponent} from './components/test.component';
import {CourseListComponent} from './components/course-list.component';
import { ErrorListComponent }from './components/error-list.component';
import {TestService} from './services/test.service';
import  {InitService } from './services/ini.service';

import { ICourse } from './models/course';
import { ISubject, Subject } from './models/subject';
import { Rule, IRule, Result } from './models/rule';
import { IFaculty, Faculty } from './models/faculty';



@NgModule({
  declarations: [
    TestComponent,
    CourseListComponent,
    ErrorListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EngineRoutingModule
  ],
  providers: [
    TestService,
    InitService
  ]
})

export class TestsModule {}
export { Rule, IRule } 

