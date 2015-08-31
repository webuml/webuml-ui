export = Vec2;

class Vec2 {

  constructor(public x: number, public y: number) {

  }

  toString(): string {
    return this.x + "," + this.y + " "
  }

}