import {ICourse } from './course';

export interface IRule {
  $key?: string;
  id: string;
  type: number;
  courses: string[];

  evaluate (courses: ICourse[]): Result[];
}

export class Rule implements IRule {
  $key?: string;
  id: string;
  type: number;
  courses: string[];

  constructor(rule: any) {
      this.type = rule.type;
      this.courses = rule.courses;
   }

   evaluate(courses: ICourse[]) : Result[]{
     let results:  Result[] = [];
   
        // each rule type is evaluated differently
        switch(this.type)
        {
            case 1:
             results.push(this.evaulateRuleTypeOne(courses, this.courses));
             break;

            case 2:
             results.push(this.evaulateRuleTypeTwo(courses, this.courses));
             break;
        }

        return results;
   }

   private evaulateRuleTypeOne(courses:ICourse[], required:string[]) : Result
  {
    // for this rule type, courses must have ALL courses from required
    let missing = required.filter( function( req_code ) {
      return !courses.find( (c) => { return c.code == req_code }); 
    });
    if(missing.length > 0)
    {
       return new Result(['must select all> ' + required.toString()]);
    }
    return new Result([]);
  }

  private evaulateRuleTypeTwo(courses:ICourse[], required:string[]) : Result
  {
    // for this rule type, courses must have at least one course from required
    let found = required.filter( function( req_code ) {
      return courses.find( (c) => { return c.code == req_code });
    });
    if(found.length === 0)
    {
       return new Result(['must select one from ' + required.toString()]);
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