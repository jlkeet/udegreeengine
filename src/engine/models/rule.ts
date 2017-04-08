import { ICourse, IRule, Result } from '../index';
import { RuleOne, RuleTwo, RuleThree, RuleFour, RuleFive, RuleSix, RuleSeven } from '../index';

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
  groups?: string[][];

  evaluate(courses: ICourse[]): Result;
}


export abstract class Rule implements IRule {
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
  groups?: string[][];

  abstract evaluate(courses: ICourse[]) : Result;

  static createRule(data: any): IRule {
    switch(data.type)
    {
      case 1:
        return new RuleOne(data);

      case 2:
        return new RuleTwo(data);      

      case 3:
        return new RuleThree(data);          

      case 4:
        return new RuleFour(data); 

      case 5:
        return new RuleFive(data);

      case 6:
        return new RuleSix(data);

      case 7:
        return new RuleSeven(data);                                   
    }

  }

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
}

