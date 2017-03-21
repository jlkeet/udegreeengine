export interface ISubject {
  $key?: string;
  name: string;
  faculty: string;
}

export class Subject implements ISubject {
  $key?: string;
  name: string;
  faculty: string;

  constructor(subject: any) {
      //console.log(subject);
      this.$key = subject.$key;
      this.name = subject.name;
      this.faculty = subject.faculty;
   }
}