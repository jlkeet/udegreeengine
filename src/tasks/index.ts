import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth';

import { AutoFocusDirective } from './directives/autofocus-directive';

import { HomeComponent }from './components/home.component';
import { CourseService }from './services/course-service';

const routes: Routes = [
  {path: 'tasks', component: HomeComponent, canActivate: [AuthGuard]}
];


@NgModule({
  declarations: [
    AutoFocusDirective,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    CourseService
  ]
})

export class TasksModule {}

export { CourseService };
