export interface ISubject {
  $key?: string;
  subject: string;
}

export class Subject implements ISubject {
  $key?: string;
  subject: string;

  constructor(subject: any) {
      //console.log(subject);
      this.$key = subject.$key;
      this.subject = subject.$value;
   }
}