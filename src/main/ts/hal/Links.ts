//   interface Link {
//    rel: string;
//    href: string;
//    title?: string;
//  }

export = Links;
class Links {

  linkMap: { [index: string]: string; } = {};

  self(): string {
    return this.linkMap['self'];
  }

  set(relation: string, href: string) {
    this.linkMap[relation] = href;
  }

  get(relation: string) {
    return this.linkMap[relation];
  }
}

