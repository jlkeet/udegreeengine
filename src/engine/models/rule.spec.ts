import { Rule, Result } from './rule';
import { Course } from './course';

//[UnitOfWork_StateUnderTest_ExpectedBehavior]

describe('models/', () => {
  describe('Rule', () => {
    it('evaulateRuleTypeOne_RequirementsNotMet_ReturnsFalse', () => {
 // for this rule type, courses must have ALL courses from required
     let rule = new Rule({ 
         type: 1, 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100',  'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 200', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });

    it('evaulateRuleTypeOne_RequirementsMet_ReturnsTrue', () => {
 // for this rule type, courses must have ALL courses from required
     let rule = new Rule({ 
         type: 1, 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100', 'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 100', credits: 15 }), new Course( { code: 'ARCHDES 101', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });    

     it('evaulateRuleTypeTwo_RequirementsNotMet_ReturnsFalse', () => {
  // for this rule type, courses must have at least one course from required
     let rule = new Rule({ 
         type: 2, 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100',  'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 200', credits: 15 })]
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(false);
    });

    it('evaulateRuleTypeTwo_RequirementsMet_ReturnsTrue', () => {
  // for this rule type, courses must have at least one course from required
     let rule = new Rule({ 
         type: 2, 
         degree: 'B1', 
         ruleid: 'B11', 
         //required courses
         courses: ['ARCHDES 100', 'ARCHDES 101' ]
         });

         let courses = [new Course( { code: 'ARCHDES 100', credits: 15 })];
         let result = rule.evaluate(courses);

      expect(result.passed).toBe(true);
    });    


     it('evaulateRuleTypeThree_RequirementsNotMet_ReturnsFalse', () => {
      // for this rule type, must choose X credits from course list
     let rule = new Rule({ 
         type: 3, 
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
     let rule = new Rule({ 
         type: 3, 
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

    it('evaulateRuleTypeFour_RequirementsNotMet_ReturnsFalse', () => {
 // for this rule type, must choose at least X credits from 2 of the 3 groups
     let rule = new Rule({ 
         type: 4, 
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
     let rule = new Rule({ 
         type: 4, 
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
     let rule = new Rule({ 
         type: 4, 
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
     let rule = new Rule({ 
         type: 4, 
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

    //PreRequisite
    it('evaulateRuleTypeFive_RequirementsMet_ReturnsTrue', () => {
      // for this rule type, must choose all courses in preerqs, in earlier semester
     let rule = new Rule({ 
         type: 5, 
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
     let rule = new Rule({ 
         type: 5, 
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
     let rule = new Rule({ 
         type: 5, 
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

   //Restriction
    it('evaulateRuleTypeSix_RequirementsMet_ReturnsTrue', () => {
      // for this rule type, must choose all courses in preerqs, in earlier semester
     let rule = new Rule({ 
         type: 6, 
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
      // for this rule type, must choose all courses in preerqs, in earlier semester
     let rule = new Rule({ 
         type: 6, 
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
      
  });
});
