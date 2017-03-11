import { ICourse } from './course';

export interface IRule {
  $key?: string;
  id: string;
  type: number;
  courses: string[];
  credits: number;

  evaluate(courses: ICourse[]): Result[];
}

export class Rule implements IRule {
  $key?: string;
  id: string;
  type: number;
  courses: string[];
  credits: number;

  constructor(rule: any) {
    this.type = rule.type;
    this.courses = rule.courses;
    this.credits = rule.credits;
  }

  evaluate(courses: ICourse[]): Result[] {
    let results: Result[] = [];

    // each rule type is evaluated differently
    switch (this.type) {
      case 1:
        results.push(this.evaulateRuleTypeOne(courses, this.courses));
        break;

      case 2:
        results.push(this.evaulateRuleTypeTwo(courses, this.courses));
        break;

      case 3:
        results.push(this.evaulateRuleTypeThree(courses, this.courses, this.credits));
        break;        
    }

    return results;
  }

  private evaulateRuleTypeOne(courses: ICourse[], required: string[]): Result {
    // for this rule type, courses must have ALL courses from required
    let missing = required.filter(function (req_code) {
      return !courses.find((c) => { return c.code == req_code });
    });
    if (missing.length > 0) {
      return new Result(['must select all of > ' + required.toString()]);
    }
    return new Result([]);
  }

  private evaulateRuleTypeTwo(courses: ICourse[], required: string[]): Result {
    // for this rule type, courses must have at least one course from required
    let found = required.filter(function (req_code) {
      return courses.find((c) => { return c.code == req_code });
    });
    if (found.length === 0) {
      return new Result(['must select one from ' + required.toString()]);
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
      return new Result([`must select ${creditsRequired} credits from` + required.toString()]);
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