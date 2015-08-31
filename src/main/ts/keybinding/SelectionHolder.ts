export = SelectionHolder;

class Selection {

  private content:any[];

  public get():any[] {
    return this.content;
  }

  public set(selection:any[]) {
    this.content = selection;
  }

  public include(selection:any) {

  }

  public exclude(selection:any) {

  }

}

class SelectionHolder {
  static currentSelection:Selection = new Selection();
}