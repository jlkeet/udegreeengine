import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EngineService } from './services/engine.service';
import { InitService } from './services/ini.service';

import { ICourse, Course } from './models/course';
import { ISubject, Subject } from './models/subject';
import { Rule, IRule, Result } from './models/rule';
import { IFaculty, Faculty } from './models/faculty';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
      EngineService,
      InitService
  ]
})

export class EngineModule {}

export { ICourse, ISubject, IFaculty, IRule }
export { Course, Subject, Faculty, Result }
export { EngineService, InitService }