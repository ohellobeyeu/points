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

var usage = 'gauth <code>';
exports.usage = usage;
var short = 'Authenticate with Google.';
exports.short = short;
var description = 'Authenticate a Google accounnt with the bot. Required before using a google Sheet.';
exports.description = description;
var aliases = ['googleauth', 'auth'];
exports.aliases = aliases;
var examples = ['gauth', 'gauth 3/4gBP2D8QhvcESmz...'];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

  if (!CONFIG.GOOGLE_CLIENT_ID || !CONFIG.GOOGLE_CLIENT_SECRET || !CONFIG.GOOGLE_PROJECT_ID) {
    message.channel.send(utils.formatResponse('neg', 'No client', 'Bot owner has not set up OAuth2 authentication.'));
    return;
  }

  var msg = utils.stripCommand(message);

  if (GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
    message.channel.send(utils.formatResponse('neg', 'Already authenticated', "Please run `".concat(utils.getPrefix(message), "greset` if you wish to reauthenticate.")));
    return;
  }

  if (msg) {
    GOOGLE_AUTH.getToken(msg, function (err, token) {
      if (err) {
        message.channel.send(utils.formatResponse('neg', 'Failed authenticating', 'Please check your code.'));
      } else {
        utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
          GOOGLE_TOKEN: token
        }));
        message.channel.send(utils.formatResponse('pos', '', 'Authentication successful!'));
      }
    });
  } else {
    var authUrl = GOOGLE_AUTH.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets']
    });
    message.channel.send("Get Google authorization code here: __".concat(authUrl, "__\n") + "Enter code as follows: `".concat(utils.getPrefix(message), "gauth <code>`"));
  }
}