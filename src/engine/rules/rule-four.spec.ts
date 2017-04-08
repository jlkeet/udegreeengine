import { Course } from '../models/course';
import { Rule } from '../models/rule';
import { RuleFour } from './rule-four'

describe('Rule Four', () => {

    it('evaulateRuleTypeFour_RequirementsNotMet_ReturnsFalse', () => {
 // for this rule type, must choose at least X credits from 2 of the 3 groups
     let rule = new RuleFour({ 
         degree: 'B1', 
         ruleid: 'B16', 
         credits: 15,
         groups: [
             ['ARCHDES 200',  'ARCHTECH 207'], 
             ['ARCHTECH 208', 'ARCHDRC 302'], 
             ['ARCHHTC 235', 'ARCHDES 201']
             ]
         });

         let courses = [new Course( { code: 'ARCHDES 200', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });


    it('evaulateRuleTypeFour_RequirementsMet12_ReturnsTrue', () => {
 // for this rule type, must choose at least X credits from 2 of the 3 groups
     let rule = new RuleFour({ 
         degree: 'B1', 
         ruleid: 'B16', 
         credits: 15,
         groups: [
             ['ARCHDES 200',  'ARCHTECH 207'], 
             ['ARCHTECH 208', 'ARCHDRC 302'], 
             ['ARCHHTC 235', 'ARCHDES 201']
             ]
         });

         let courses = [
             new Course( { code: 'ARCHDES 200', credits: 15 }),
            new Course( { code: 'ARCHTECH 208', credits: 15 }),
            new Course( { code: 'ARCHDES 222', credits: 15 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });   

    it('evaulateRuleTypeFour_RequirementsMet23_ReturnsTrue', () => {
 // for this rule type, must choose at least X credits from 2 of the 3 groups
     let rule = new RuleFour({ 
         degree: 'B1', 
         ruleid: 'B16', 
         credits: 15,
         groups: [
             ['ARCHDES 200',  'ARCHTECH 207'], 
             ['ARCHTECH 208', 'ARCHDRC 302'], 
             ['ARCHHTC 235', 'ARCHDES 201']
             ]
         });

         let courses = [
             new Course( { code: 'ARCHDRC 302', credits: 15 }),
            new Course( { code: 'ARCHTECH 208', credits: 15 }),
            new Course( { code: 'ARCHHTC 235', credits: 15 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });    

    it('evaulateRuleTypeFour_RequirementsMet13_ReturnsTrue', () => {
 // for this rule type, must choose at least X credits from 2 of the 3 groups
     let rule = new RuleFour({ 
         degree: 'B1', 
         ruleid: 'B16', 
         credits: 15,
         groups: [
             ['ARCHDES 200',  'ARCHTECH 207'], 
             ['ARCHTECH 208', 'ARCHDRC 302'], 
             ['ARCHHTC 235', 'ARCHDES 201']
             ]
         });

         let courses = [
             new Course( { code: 'ARCHTECH 207', credits: 15 }),
            new Course( { code: 'ARCHDES 200', credits: 15 }),
            new Course( { code: 'ARCHHTC 235', credits: 15 })
            ];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });     

}) 