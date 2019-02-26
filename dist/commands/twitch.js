"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var _request = _interopRequireDefault(require("request"));

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
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

var usage = 'twitch <username>';
exports.usage = usage;
var short = 'List / Add / Remove Twitch stream watch.';
exports.short = short;
var description = "Add / Remove live notifications for a Twitch stream. Emit username to list all watched.";
exports.description = description;
var aliases = ['stream', 'streams'];
exports.aliases = aliases;
var examples = ['twitch', 'twitch studio_trigger'];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  var msg = utils.stripCommand(message);

  if (!msg) {
    if (GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.length) {
      return message.channel.send(":film_frames: **Twitch streams:**\n".concat(GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.map(function (member) {
        return "`".concat(member.split('::')[0], "`");
      }).join(' **|** ')));
    }

    return message.channel.send(utils.formatResponse('neg', '', 'No streamers are being watched.'));
  }

  if (GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.map(function (i) {
    return i.split('::')[0].toLowerCase();
  }).indexOf(msg.toLowerCase()) !== -1) {
    utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
      TWITCH_STREAMS: GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS.filter(function (i) {
        return i.split('::')[0].toLowerCase() !== msg.toLowerCase();
      })
    }));
    utils.removeWebHook(msg);
    message.channel.send(utils.formatResponse('pos', '', "**".concat(msg, "** is no longer being watched.")));
  } else {
    (0, _request.default)({
      method: 'GET',
      uri: "https://api.twitch.tv/helix/users?login=".concat(msg),
      headers: {
        'Client-ID': CONFIG.TWITCH_CLIENT_ID
      }
    }, function (err, _, body) {
      if (err) {
        return message.channel.send(utils.formatResponse('neg', '', "Twitch API error looking up `".concat(msg, "`.")));
      }

      var res = JSON.parse(body).data;

      if (res && res.length) {
        var twitchID = res[0].id;
        utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
          TWITCH_STREAMS: _toConsumableArray(GUILD_CONFIGS[message.guild.id].TWITCH_STREAMS).concat(["".concat(msg, "::").concat(twitchID)])
        }));
        utils.createWebHooks([msg]);
        message.channel.send(utils.formatResponse('pos', '', "**".concat(msg, "** is now being watched!")));
      } else {
        message.channel.send(utils.formatResponse('neg', '', "Found no Twitch user named `".concat(msg, "`.")));
      }
    });
  }
}