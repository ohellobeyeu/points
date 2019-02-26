"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var _commands = _interopRequireDefault(require("../commands"));

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var usage = 'help <command>';
exports.usage = usage;
var short = 'Command list and help.';
exports.short = short;
var description = "List the total list of commands or get specifics on a single command.";
exports.description = description;
var aliases = ['h'];
exports.aliases = aliases;
var examples = ['help', 'help prefix'];
exports.examples = examples;
var group = 'utlity';
exports.group = group;

function run(message) {
  var prefix = utils.getPrefix(message);
  var msg = utils.stripCommand(message).toLowerCase();

  if (msg) {
    var cmd = _commands.default[msg];

    if (cmd) {
      message.channel.send("`".concat(prefix).concat(cmd.usage, "`: ").concat(cmd.description, "\n") + (cmd.aliases && cmd.aliases.length > 0 ? "**Aliases**: ".concat(cmd.aliases.map(function (a) {
        return "`".concat(a, "`");
      }).join(', '), "\n") : '') + (cmd.examples && cmd.examples.length > 0 ? "**Examples**: ".concat(cmd.examples.map(function (e) {
        return "`".concat(prefix).concat(e, "`");
      }).join(', '), "\n") : ''));
    } else {
      message.channel.send("No such command. Try `".concat(prefix, "help` for a list of all commands."));
    }
  } else {
    var _msg = ':mega: **Commands**\n';
    var groups = {};
    Object.keys(_commands.default).forEach(function (command) {
      if (!_commands.default[command].alias) {
        if (!groups[_commands.default[command].group]) {
          groups[_commands.default[command].group] = {};
        }

        groups[_commands.default[command].group][command] = _commands.default[command];
      }
    });
    Object.keys(groups).forEach(function (group) {
      _msg += "**".concat(group, "**:\n");
      Object.keys(groups[group]).forEach(function (command) {
        _msg += "`".concat(prefix).concat(command, "`: ").concat(_commands.default[command].short, "\n");
      });
    });
    message.channel.send(_msg);
  }
}