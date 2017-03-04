export interface IRule {
  $key?: string;
  id: string;
  type: number;
  courses: string[];
}

export class Rule implements IRule {
  $key?: string;
  id: string;
  type: number;
  courses: string[];

  constructor(type: number, courses: string[]) {
      //console.log(subject);
      this.type = type;
      this.courses = courses;
   }
}

export class Result {
    passed: boolean;
    errors: string[];

    constructor(errors: string[]) {
      //console.log(subject);
      this.passed = errors.length === 0;
      this.errors = errors;
   }    
}