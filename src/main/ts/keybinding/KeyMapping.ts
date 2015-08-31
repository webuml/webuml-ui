/// <reference path="../global_typings/keymaster.d" />

export = KeyMapping;

import DeleteCommand = require('commands/DeleteCommand');
import CommandDispatcher = require('commands/CommandDispatcher');

class KeyMapping {

  public static init() {
    key('del, delete, backspace', function (keyboardEvent:KeyboardEvent, keymasterEvent:KeymasterEvent) {
      var command = new DeleteCommand.DeleteCommand();
      CommandDispatcher.dispatch(command);
      // TODO (20140628, maki): Default KeyHandling unterdrücken, sonst navigiert der Browser eine Seite zurück bei BACKSPACE: event.preventDefault = true
    });

    key('ctrl+z, ⌘+z', function (keyboardEvent:KeyboardEvent, keymasterEvent:KeymasterEvent) {
      CommandDispatcher.undoLastCommand();
    });
  }
}