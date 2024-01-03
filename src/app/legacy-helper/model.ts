// TODO: class 加入 id 進行識別

export class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Player {
  person: Person;

  constructor(name: string) {
    this.person = new Person(name);
  }
}
