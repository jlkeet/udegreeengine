import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleSeven } from './rule-seven';

describe('Rule Seven', () => {

     //CoRequsiites
    it('evaulateRuleTypeSeven_RequirementsMet_ReturnsTrue', () => {
      // for this rule type, must at least one corequisite in same semester
     let rule = new RuleSeven({ 
         degree: 'B1', 
         course:'FINEARTS 101',
         ruleid: 'B19', 
         corequisites: ['FINEARTS 103', 'FINEARTS 104'],
             
         });

         let courses = [
             new Course( { code: 'FINEARTS 101', semester: 1  }),
            new Course( { code: 'FINEARTS 103', semester: 1 }),
            new Course( { code: 'ARCHDES 200', semester: 1  })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });  

    it('evaulateRuleTypeSeven_RequirementsMet2_ReturnsTrue', () => {
      // for this rule type, must at least one corequisite in same semester
     let rule = new RuleSeven({ 
         degree: 'B1', 
         ruleid: 'B19',
         course:'FINEARTS 101', 
         corequisites: ['FINEARTS 103', 'FINEARTS 104'],
             
         });

         let courses = [
             new Course( { code: 'FINEARTS 101', semester: 1  }),
            new Course( { code: 'FINEARTS 103', semester: 1 }),
            new Course( { code: 'FINEARTS 104', semester: 1 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });   
     

    it('evaulateRuleTypeSeven_NoCoRequisiteCoursePlanned_ReturnsFalse', () => {
      // for this rule type, must at least one corequisite in same semester
     let rule = new RuleSeven({ 
         degree: 'B1', 
         ruleid: 'B18', 
         course:'FINEARTS 101',
         corequisites: ['FINEARTS 103', 'FINEARTS 104'],
             
         });

         let courses = [
             new Course( { code: 'FINEARTS 101', semester: 1  }),
            new Course( { code: 'ARCHDES 103', semester: 1 }),
            new Course( { code: 'ARCHDES 104', semester: 1 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    }); 

    it('evaulateRuleTypeSeven_CoRequisiteNotSameSemester_ReturnsFalse', () => {
      // for this rule type, must at least one corequisite in same semester
     let rule = new RuleSeven({ 
         degree: 'B1', 
         ruleid: 'B18', 
         course:'FINEARTS 101',
         corequisites: ['FINEARTS 103', 'FINEARTS 104'],
             
         });

         let courses = [
             new Course( { code: 'FINEARTS 101', semester: 1  }),
            new Course( { code: 'FINEARTS 103', semester: 2 }),
            new Course( { code: 'ARCHDES 104', semester: 1 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });        

}) 