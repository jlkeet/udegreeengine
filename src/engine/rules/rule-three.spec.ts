import {
  async,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleThree } from './rule-three'

describe('Rule Three', () => {

  let evaluator;

  //given how many dependencies the dependent services have, better to use a testbed so we can inject Fake Services
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: []
    });
  });
   
  it('ready for test', () => {
      expect(true).toBe(true);
  });

     it('evaulateRuleTypeThree_RequirementsNotMet_ReturnsFalse', () => {
      // for this rule type, must choose X credits from course list
     let rule = new RuleThree({ 
         degree: 'B1', 
         ruleid: 'B11', 
         credits: 30,
         //required courses
         courses: ['ARCHDES 100',  'ARCHDES 101', 'ARCHDES 102' ]
         });

         let courses = [new Course( { code: 'ARCHDES 100', credits: 15 })];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });

    it('evaulateRuleTypeThree_RequirementsMet_ReturnsTrue', () => {
    // for this rule type, must choose X credits from course list
     let rule = new RuleThree({ 
         degree: 'B1', 
         ruleid: 'B11', 
         credits: 30,
         //required courses
         courses: ['ARCHDES 100', 'ARCHDES 101', 'ARCHDES 102' ]
         });

         let courses = [new Course( { code: 'ARCHDES 100', credits: 15 }), new Course( { code: 'ARCHDES 101', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });      

}) 