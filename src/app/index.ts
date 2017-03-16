import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, Router } from '@angular/router';

import { AuthModule } from '../auth';
import { FirebaseModule } from '../firebase';
import { TasksModule } from '../tasks';
import { TestsModule } from '../perf-test';

import { AppComponent } from './components/app';
import { AppHeaderComponent } from './components/app-header';
import { AppRoutingModule } from './app-routing'

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent
  ],
  imports: [
    BrowserModule,
    TestsModule,
    AuthModule,
    FirebaseModule,
    AppRoutingModule
    
  ]
})

export class AppModule {
  constructor (private router: Router){
  }
}

