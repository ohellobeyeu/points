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

var keys = ['GOOGLE_SHEET_ID', 'GOOGLE_SHEET_NAME'];
var usage = 'key <key> <value>';
exports.usage = usage;
var short = 'Get / set local server variables.';
exports.short = short;
var description = "Give the bot a key value pair local to your server.\n**Valid keys**: ".concat(utils.encodedStringArray(keys), ".");
exports.description = description;
var aliases = ['var'];
exports.aliases = aliases;
var examples = ['key GOOGLE_SHEET_ID', 'key GOOGLE_SHEET_ID 1dZHv5z2f-BcPuc...'];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));
  var keyValuePair = utils.stripCommand(message).split(' ');

  if (keyValuePair.length === 1 && keyValuePair[0]) {
    var key = keyValuePair[0].toUpperCase();
    var value = GUILD_CONFIGS[message.guild.id][key];

    if (validKey(key)) {
      if (value) {
        message.channel.send("`".concat(key, "`: ").concat(value));
      } else {
        message.channel.send(utils.formatResponse('neg', '', "`".concat(key, "` has not been set.")));
      }
    } else {
      message.channel.send(utils.formatResponse('neg', 'Invalid key', "Valid keys: ".concat(utils.encodedStringArray(keys))));
    }
  } else if (keyValuePair.length === 2) {
    var _key = keyValuePair[0].toUpperCase();

    var _value = keyValuePair[1];

    if (validKey(_key)) {
      utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], _defineProperty({}, _key, _value)));
      message.channel.send(utils.formatResponse('pos', '', "`".concat(_key, "` saved.")));
    } else {
      message.channel.send(utils.formatResponse('neg', 'Invalid key', "Valid keys: ".concat(utils.encodedStringArray(keys))));
    }
  } else {
    message.channel.send(utils.formatResponse('neg', 'Invalid input', "Please check your command. Refer to `".concat(utils.getPrefix(message), "help` for the correct syntax.")));
  }
}

var validKey = function validKey(key) {
  return keys.indexOf(key) !== -1;
};