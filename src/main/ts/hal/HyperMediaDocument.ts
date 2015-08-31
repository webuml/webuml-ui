export = HyperMediaDocument;

interface RelationType {
  href: string;
  title: string;
}

interface RelationsMap {
  [relationName: string]: RelationType;
}

class HyperMediaDocument<DataType, EmbeddedType> {

  private data: any;
  private links: RelationsMap = {};
  private embedded: any;

  public constructor(data: any) {
    if (!data) return;
    if (data._links) {
      this.links = data._links;
      delete data._links;
    }
    if (data._embedded) {
      this.embedded = data._embedded;
      delete data._embedded;
    }
    this.data = data;
  }

  public getData(): DataType {
    return this.data;
  }

  public getEmbedded(): EmbeddedType {
    return this.embedded;
  }

  public getSelfLink(): string {
    return this.getHref("self");
  }

  public getHref(relation: string): string {
    if (this.links[relation]) {
      return this.links[relation].href;
    }
    return null;
  }

  public getHalLinkObject(): {[relationName: string]: { href: string; title: string;};} {
    return this.links;
  }
}

