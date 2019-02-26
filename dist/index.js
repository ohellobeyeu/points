"use strict";

var _index = require("googleapis/build/src/index");

var _discord = _interopRequireDefault(require("discord.js"));

var utils = _interopRequireWildcard(require("./utils"));

var _commands = _interopRequireDefault(require("./commands"));

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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

require('@babel/polyfill');
/**
 * Global variables:
 *
 * CLIENT: Connected Discord websocket client.
 * CONFIG: Global bot config, has for example Discord API key.
 * GOOGLE_AUTH: OAuth2 client used when generating access tokens.
 * GUILD_CONFIGS: Local bot configs for all connected servers, has for example command prefix.
 * GUILD_TEMP: Guild things that shouldn't be saved to disk, such as Google auth client.
 */


global.CLIENT = new _discord.default.Client();
global.CONFIG = {};
global.GOOGLE_AUTH = null;
global.GUILD_CONFIGS = {};
global.GUILD_TEMP = {};

try {
  CONFIG = require('../config.json');
  global.GOOGLE_AUTH = new _index.google.auth.OAuth2(CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob');
} catch (e) {
  throw 'Error: config.json file does not exist in project root.';
}

CLIENT.on('ready', function () {
  utils.checkReboot();
  utils.loadGuildConfigs(CLIENT.guilds);
  CLIENT.user.setActivity('Thư kí TEAM!');
  console.log("Logged in in as ".concat(CLIENT.user.tag, "!"));
  console.log("Serving ".concat(CLIENT.guilds.size, " server").concat(CLIENT.guilds.size > 1 ? 's' : ''));
});
CLIENT.on('guildCreate', function (guild) {
  utils.guildCreate(guild);
  console.log("New guild: ".concat(guild.name, " (id: ").concat(guild.id, "), users: ").concat(guild.memberCount));
  console.log("Serving ".concat(CLIENT.guilds.size, " server").concat(CLIENT.guilds.size > 1 ? 's' : ''));
});
CLIENT.on('guildDelete', function (guild) {
  utils.guildDelete(guild);
  console.log("Deleted guild: ".concat(guild.name, " (id: ").concat(guild.id, ")"));
  console.log("Serving ".concat(CLIENT.guilds.size, " server").concat(CLIENT.guilds.size > 1 ? 's' : ''));
});
CLIENT.on('message',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(message) {
    var prefix, cmd;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (message.guild) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            if (!message.author.bot) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            prefix = utils.getPrefix(message);

            if (message.content.toLowerCase().startsWith(prefix)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return");

          case 7:
            cmd = _commands.default[message.content.split(' ')[0].slice(prefix.length).toLowerCase()];
            if (cmd) cmd.run(message);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
CLIENT.login(CONFIG.DISCORD_TOKEN);
/* app.get('/twitch', function (req, res) {
    if (!req.query['hub.challenge']) {
      utils.twitchStatusChange(req);
    } else {
      console.log('Webhook challenge hit.');
    }

    res.send(req.query['hub.challenge'] ? req.query['hub.challenge'] : 'No challenge!');
});

app.listen(CONFIG.TWITCH_WEBHOOKS_PORT, () => console.log(`Twitch webhooks listening on port ${CONFIG.TWITCH_WEBHOOKS_PORT}`));
*/

process.on('SIGINT', function () {
  // utils.destroyWebHooks();
  process.exit(0);
});