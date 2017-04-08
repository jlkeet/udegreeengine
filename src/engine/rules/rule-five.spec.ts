import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleFive } from './rule-five'

describe('Rule Five', () => {

   //PreRequisite
    it('evaulateRuleTypeFive_RequirementsMet_ReturnsTrue', () => {
      // for this rule type, must choose all courses in preerqs, in earlier semester
     let rule = new RuleFive({ 
         degree: 'B1', 
         course: 'ARCHDES 200',
         ruleid: 'B17', 
         preerqs: ['ARCHDES 100',  'ARCHTECH 110'],
             
         });

         let courses = [
             new Course( { code: 'ARCHDES 100', credits: 15, semester: 1 }),
            new Course( { code: 'ARCHTECH 110', credits: 15, semester: 1 }),
            new Course( { code: 'ARCHDES 200', credits: 15, semester: 2 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });        

    //PreRequisite
    it('evaulateRuleTypeFive_CourseMissing_ReturnsFalse', () => {
      // for this rule type, must choose all courses in preerqs, in earlier semester
     let rule = new RuleFive({ 
         degree: 'B1', 
         course: 'ARCHDES 200',
         ruleid: 'B17', 
         preerqs: ['ARCHDES 100',  'ARCHTECH 110'],
             
         });

         let courses = [
             new Course( { code: 'ARCHMOP 100', credits: 15, semester: 1 }),
            new Course( { code: 'ARCHTECH 110', credits: 15, semester: 1 }),
            new Course( { code: 'ARCHDES 200', credits: 15, semester: 2 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });    

    //PreRequisite
    it('evaulateRuleTypeFive_CourseInSameSemester_ReturnsFalse', () => {
      // for this rule type, must choose all courses in preerqs, in earlier semester
     let rule = new RuleFive({ 
         degree: 'B1', 
         course: 'ARCHDES 200',
         ruleid: 'B17', 
         preerqs: ['ARCHDES 100',  'ARCHTECH 110'],
             
         });

         let courses = [
             new Course( { code: 'ARCHDES 100', credits: 15, semester: 2 }),
            new Course( { code: 'ARCHTECH 110', credits: 15, semester: 1 }),
            new Course( { code: 'ARCHDES 200', credits: 15, semester: 2 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });      

}) 