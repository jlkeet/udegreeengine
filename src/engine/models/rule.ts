import { ICourse } from './course';

export interface IRule {
  $key?: string;
  id: string;
  degree: string;
  ruleid: string;
  type: number;
  course?: string;
  courses?: string[];
  preerqs?: string[];
  restrictions?:string[];
  corequisites?:string[];
  credits?: number;
  groups?: string[][]

  evaluate(courses: ICourse[]): Result;
}

export class Rule implements IRule {
  $key?: string;
  id: string;
  degree: string;
  ruleid: string;
  type: number;
  course?: string;
  courses?: string[];
  preerqs?: string[];
  restrictions?:string[];
  corequisites?:string[];
  credits?: number;
  groups?: string[][]

  constructor(rule: any) {
    this.type = rule.type;
    this.ruleid = rule.ruleid;
    this.degree = rule.degree;
    this.id = rule.id;
    this.course = rule.course;
    this.courses = rule.courses;
    this.preerqs = rule.preerqs;
    this.restrictions = rule.restrictions;
    this.corequisites = rule.corequisites;
    this.credits = rule.credits;
    this.groups = rule.groups;
  }

  evaluate(courses: ICourse[]): Result {

    // each rule type is evaluated differently
    switch (this.type) {
      case 1:
        return this.evaulateRuleTypeOne(courses, this.courses);

      case 2:
        return this.evaulateRuleTypeTwo(courses, this.courses);

      case 3:
        return this.evaulateRuleTypeThree(courses, this.courses, this.credits);

      case 4:
        return this.evaulateRuleTypeFour(courses, this.groups, this.credits);

      case 5:
        return this.evaulateRuleTypeFive(courses, this.course, this.preerqs);   

      case 6:
        return this.evaulateRuleTypeSix(courses,this.restrictions);  

      case 7:
        return this.evaulateRuleTypeSeven(courses, this.course, this.corequisites);                        
    }
  }

  private evaulateRuleTypeOne(courses: ICourse[], required: string[]): Result {
    // for this rule type, courses must have ALL courses from required
    let missing = required.filter(function (req_code) {
      return !courses.find((c) => { return c.code == req_code });
    });
    if (missing.length > 0) {
      return new Result([`(1) must select all of [ ${required} ]`]);
    }
    return new Result([]);
  }

  private evaulateRuleTypeTwo(courses: ICourse[], required: string[]): Result {
    // for this rule type, courses must have at least one course from required
    let found = required.filter(function (req_code) {
      return courses.find((c) => { return c.code == req_code });
    });
    if (found.length === 0) {
      return new Result([`(2) must select one from [${required}]`]);
    }
    return new Result([]);
  }
  // Selection
  private evaulateRuleTypeThree(courses: ICourse[], required: string[], creditsRequired: number): Result {
    // for this rule type, must choose X credits from course list
    let creditsPlanned = 0;
    let found = courses.forEach(function (course) {
      if(required.find( r => { return r == course.code }))
      {
        creditsPlanned += course.credits;
      }
    });
    
    if (creditsPlanned <  creditsRequired) {
      return new Result([`(3) must select ${creditsRequired} credits from` + required.toString()]);
    }
    return new Result([]);
  }  
  private evaulateRuleTypeFour(courses: ICourse[], groups: string[][], creditsRequired: number): Result {
    
    // for this rule type, must choose at least X credits from 2 of the 3 groups
    let groupOneCredits = courses.filter(function (course) {
      return groups[0].find( g => { return course.code == g });
    }).reduce((a, b) => a + b.credits, 0);

    let groupTwoCredits = courses.filter(function (course) {
      return groups[1].find( g => { return course.code == g });
    }).reduce((a, b) => a + b.credits, 0);

    let groupThreeCredits = courses.filter(function (course) {
      return groups[2].find( g => { return course.code == g });
    }).reduce((a, b) => a + b.credits, 0); 

    let totalCreditsRequired = 2 * creditsRequired;
    if(
      groupOneCredits + groupTwoCredits === totalCreditsRequired ||
      groupTwoCredits + groupThreeCredits === totalCreditsRequired ||
      groupOneCredits + groupThreeCredits === totalCreditsRequired
      )       
    {
       return new Result([]);
       
    }
    return new Result([`(4) must select ${creditsRequired} credits from two of the following groups` + groups.toString()]);
   
  }    

  private evaulateRuleTypeFive(courses: ICourse[], course: string, prereqs: string[]): Result {
    // for this rule type, courses must have ALL courses from prereqs in semesters earlier than course
    let plannedCourse = courses.find(c => { return c.code == course });

    //only proceed if this clourse planned
    if (plannedCourse !== undefined) {
      let plannedSemester = plannedCourse.semester;

      let missing = prereqs.filter(function (req_code) {
        return !courses.find((c) => {
          return c.code == req_code && c.semester < plannedSemester
        });
      });
      if (missing.length > 0) {
        return new Result([`(5) must select all of [ ${prereqs} ] before semester ${plannedSemester}`]);
      }
    }
    return new Result([]);
  }

  private evaulateRuleTypeSix(courses: ICourse[], restrictions: string[]): Result 
  {
    // for this rule type, courses must NOT have ANY of courses from restrictions

    let found = restrictions.filter(function (req_code) {
      return courses.find((c) => { 
        return c.code == req_code  });
    });
    if (found.length > 0) {
      return new Result([`(6) must NOT select ANY of [ ${restrictions} ]`]);
    }
    return new Result([]);
  }  

  private evaulateRuleTypeSeven(courses: ICourse[], course: string, corequisites: string[]) {
    let plannedCourse = courses.find(c => { return c.code == course });
    //only proceed if this clourse planned
    if (plannedCourse !== undefined) {
      let plannedSemester = plannedCourse.semester;

      let coReqsPlannedInSameSemester = corequisites.filter(function (req_code) {
        return courses.find((c) => {
          return c.code == req_code && c.semester === plannedSemester
        });
      });

      if (coReqsPlannedInSameSemester.length === 0) {
        return new Result([`(7) must select AT least on of [ ${corequisites} ] in semsester ${plannedSemester}`]);
      }
    }
    return new Result([]);
  }
}

export class Result {
  passed: boolean;
  errors: string[];

  constructor(errors: string[]) {
    this.passed = errors.length === 0;
    this.errors = errors;
  }
}