export = CommandDispatcher;

import Command = require('commands/Command');

class CommandDispatcher {

  private static lastCommand:Command.Command = null;

  public static dispatch(command:Command.Command) {
    command.run();
    if (command.canUndo()){
      CommandDispatcher.lastCommand = command;
    }
  }

  public static undoLastCommand() {
    if (CommandDispatcher.lastCommand) {
      try {
        CommandDispatcher.lastCommand.undo();
      }
      finally {
        CommandDispatcher.lastCommand = null;
      }
    }
  }

}