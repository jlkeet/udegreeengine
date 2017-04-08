import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleTwo } from './rule-two'

describe('Rule Two', () => {

  it('ready for test', () => {
      expect(true).toBe(true);
  });

      it('RequirementsNotMet_ReturnsFalse', () => {
  // for this rule type, courses must have at least one course from required
     let rule = new RuleTwo({ 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100',  'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 200', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });

    it('RequirementsMet_ReturnsTrue', () => {
  // for this rule type, courses must have at least one course from required
     let rule = new RuleTwo({ 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100', 'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 100', credits: 15 })];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });  

}) 