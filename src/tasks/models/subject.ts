export interface ISubject {
  $key?: string;
  subject: string;
  faculty: string;
}

export class Subject implements ISubject {
  $key?: string;
  subject: string;
  faculty: string;

  constructor(subject: any) {
      //console.log(subject);
      this.$key = subject.$key;
      this.subject = subject.name;
      this.faculty = subject.faculty;
   }
}