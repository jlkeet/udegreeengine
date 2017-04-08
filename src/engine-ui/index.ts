import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth';

import { EngineUIRoutingModule } from './engine-ui-routing';

import { TestComponent} from './components/engine.component';
import { CourseListComponent} from './components/course-list.component';
import { ErrorListComponent }from './components/error-list.component';
import { TotalPointsComponent } from './components/total-points.component';
import { SemesterCourseListComponent } from './components/semester-course-list';
import { CourseSelectFormComponent } from './components/course-select-form';

//This Module is the UI for the engine.

@NgModule({
  declarations: [
    TestComponent,
    CourseListComponent,
    ErrorListComponent,
    TotalPointsComponent,
    SemesterCourseListComponent,
    CourseSelectFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EngineUIRoutingModule
  ]
})

export class EngineUIModule {}


