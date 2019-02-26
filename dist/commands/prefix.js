"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var usage = 'prefix <prefix>';
exports.usage = usage;
var short = 'Get / set command prefix.';
exports.short = short;
var description = "Check the current command prefix or change it to something else.";
exports.description = description;
var aliases = [];
exports.aliases = aliases;
var examples = ['prefix', 'prefix -'];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));
  var msg = utils.stripCommand(message);

  if (msg) {
    utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
      PREFIX: msg
    }));
    message.channel.send(utils.formatResponse('pos', '', "Command prefix changed to `".concat(msg, "`.")));
  } else {
    var prefix = utils.getPrefix(message);
    message.channel.send("Current command prefix: `".concat(prefix, "`."));
  }
}