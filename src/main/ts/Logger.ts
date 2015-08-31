export = Logger;

class Logger {

  public static info(...msg: string[]) {
    if (console && console.log) {
      var log = Function.prototype.bind.call(console.log, console);
      log.apply(console, arguments);
    }
  }
}
