import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EngineService } from './services/engine.service';
import { InitService } from './services/ini.service';

import { ICourse, Course } from './models/course';
import { ISubject, Subject } from './models/subject';
import { Rule, IRule } from './models/rule';
import { Result, IResult } from './models/result';
import { IFaculty, Faculty } from './models/faculty';

import { RuleOne } from './rules/rule-one';
import { RuleTwo } from './rules/rule-two';
import { RuleThree } from './rules/rule-three';
import { RuleFour } from './rules/rule-four';
import { RuleFive } from './rules/rule-five';
import { RuleSix } from './rules/rule-six';
import { RuleSeven } from './rules/rule-seven';


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
export { Course, Subject, Faculty, Result, IResult }
export { EngineService, InitService }
export { RuleOne, RuleTwo, RuleThree, RuleFour, RuleFive, RuleSix, RuleSeven }