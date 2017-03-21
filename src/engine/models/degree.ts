export interface IDegree {
  $key?: string;
  name: string;
  code: string;
}

export class Degree implements IDegree {
  $key?: string;
  name: string;
  code: string;

  constructor(degree: any) {
      this.$key = degree.$key;
      this.name = degree.name;
      this.code = degree.code;
   }
}