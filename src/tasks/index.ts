import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth';

import { TaskFormComponent } from './components/task-form';
import { TaskItemComponent } from './components/task-item';
import { TaskListComponent } from './components/task-list';
import { TasksComponent } from './components/tasks';
import { AutoFocusDirective } from './directives/autofocus-directive';
import { TaskService } from './services/task-service';

import { HomeComponent }from './components/home.component';
import { CourseService }from './services/course-service';

const routes: Routes = [
  {path: 'tasks', component: HomeComponent, canActivate: [AuthGuard]}
];


@NgModule({
  declarations: [
    AutoFocusDirective,
    TaskFormComponent,
    TaskItemComponent,
    TaskListComponent,
    TasksComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TaskService,
    CourseService
  ]
})

export class TasksModule {}

export { TaskService };
