import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleSix } from './rule-six';

describe('Rule Six', () => {

    it('evaulateRuleTypeSix_RequirementsMet_ReturnsTrue', () => {
      // for this rule type, cannot choose any course in restrictions
     let rule = new RuleSix({ 
         degree: 'B1', 
         ruleid: 'B18', 
         restrictions: ['ARCHDRC 100', 'ARCHDRC 101'],
             
         });

         let courses = [
             new Course( { code: 'ARCHDRC 102' }),
            new Course( { code: 'ARCHTECH 110'}),
            new Course( { code: 'ARCHDES 200' })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });   

    it('evaulateRuleTypeSix_RestrictedCoursePlanned_ReturnsFalse', () => {
      // for this rule type, cannot choose any course in restrictions
     let rule = new RuleSix({ 
         degree: 'B1', 
         ruleid: 'B18', 
         restrictions: ['ARCHDRC 100', 'ARCHDRC 101'],
             
         });

         let courses = [
             new Course( { code: 'ARCHDRC 102' }),
            new Course( { code: 'ARCHDRC 100'}),
            new Course( { code: 'ARCHDES 200' })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });         

}) 