export interface IResult {
   passed: boolean;
   errors: string[];
}
export class Result implements IResult {
  passed: boolean;
  errors: string[];

  constructor(errors: string[]) {
    this.passed = errors.length === 0;
    this.errors = errors;
  }
}