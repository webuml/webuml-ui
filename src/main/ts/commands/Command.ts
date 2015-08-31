export interface Command {
  run():void;
  canUndo():boolean;
  undo():void;

}
