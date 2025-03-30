export class CommandManager {
  constructor() {
    this.commands = [];
    this.redoCommands = [];
  }
  execute(command) {
    command.execute();
    this.commands.push(command);
    this.redoCommands = []; // Clear redo stack on new command
  }
  undo() {
    const command = this.commands.pop();
    if (command) {
      command.undo();
      this.redoCommands.push(command);
    }
  }
  redo() {
    const command = this.redoCommands.pop();
    if (command) {
      command.execute();
      this.commands.push(command);
    }
  }
}

export class Command {
  constructor(execute, undo) {
    this.execute = execute;
    this.undo = undo;
  }
}
