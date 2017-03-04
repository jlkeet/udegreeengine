export interface ICourse {
  $key?: string;
  subject: string;
  catalogNumber: string;
  code: string;
  level: string;
  title: string;
  description: string;
  credits: string;
  requirementGroup: number;
}

export class Course implements ICourse {
  $key?: string;
  subject: string;
  catalogNumber: string;
  code: string;
  courseCode: string;
  level: string;
  title: string;
  description: string;
  credits: string;
  requirementGroup: number;

  constructor(course: any) {
      this.subject = course.subject;
      this.catalogNumber = course.catalogNumber;
      this.code = course.code;
      this.level = course.level;
      this.title = course.title;
      this.description = course.description;
      this.credits = course.credits;
      this.requirementGroup = course.requirementGroup;
   }
}