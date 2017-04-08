import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleOne } from './rule-one'

describe('Rule One', () => {

  it('RequirementsNotMet_ReturnsFalse', () => {
   // for this rule type, courses must have ALL courses from required
     let rule = new RuleOne({ 
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
    // for this rule type, courses must have ALL courses from required
     let rule = new RuleOne({ 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100', 'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 100', credits: 15 }), new Course( { code: 'ARCHDES 101', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });    

}) 