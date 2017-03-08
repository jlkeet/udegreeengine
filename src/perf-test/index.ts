import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth';

import {TestComponent} from './components/test.component';
import {TestService} from './services/test.service';

const routes: Routes = [
  {path: 'test', component: TestComponent, canActivate: [AuthGuard]}
];


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    TestService
  ]
})

export class TestsModule {}

