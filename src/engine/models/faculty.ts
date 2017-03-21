export interface IFaculty {
  $key?: string;
  name: string;
}

export class Faculty implements IFaculty {
  $key?: string;
  name: string;

  constructor(faculty: any) {
      //console.log(subject);
      this.$key = faculty.$key;
      this.name = faculty.$value;
   }
}