"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.guildCreate = guildCreate;
exports.guildDelete = guildDelete;
exports.loadGuildConfigs = loadGuildConfigs;
exports.guildUpdate = guildUpdate;
exports.stripCommand = stripCommand;
exports.getPrefix = getPrefix;
exports.extractAliases = extractAliases;
exports.encodedStringArray = encodedStringArray;
exports.formatResponse = formatResponse;
exports.createGoogleSheetsClient = createGoogleSheetsClient;
exports.loadSpreadsheet = loadSpreadsheet;
exports.updateSpreadsheet = updateSpreadsheet;
exports.sheetFormulaTransform = sheetFormulaTransform;
exports.appendFormula = appendFormula;
exports.getUserPointsRow = getUserPointsRow;
exports.checkReboot = checkReboot;
exports.isAdmin = isAdmin;
exports.checkGuildConfig = checkGuildConfig;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _googleapis = require("googleapis");

var _request = _interopRequireDefault(require("request"));

var constants = _interopRequireWildcard(require("./constants"));

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

var mkdirSync = function mkdirSync(dirPath) {
  try {
    _fs.default.mkdirSync(dirPath);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

function guildCreate(guild) {
  var emptyConfig = _objectSpread({}, constants.EMPTY_GUILD_CONFIG, {
    ID: guild.id,
    NAME: guild.name
  });

  mkdirSync(_path.default.resolve('./servers'));
  guildUpdate(guild, emptyConfig);
  GUILD_TEMP[guild.id] = {
    POINTS: {}
  };
}

function guildDelete(guild) {
  _fs.default.unlinkSync(_path.default.resolve("./servers/".concat(guild.id, ".json")));

  delete GUILD_CONFIGS[guild.id];
}

function loadGuildConfigs(guilds) {
  mkdirSync(_path.default.resolve('./servers'));
  guilds.forEach(function (guild) {
    _fs.default.readFile(_path.default.resolve("./servers/".concat(guild.id, ".json")), function (err, data) {
      if (err) {
        // Joined a guild while offline.
        var emptyConfig = _objectSpread({}, constants.EMPTY_GUILD_CONFIG, {
          ID: guild.id,
          NAME: guild.name
        });

        guildUpdate(guild, emptyConfig);
        GUILD_TEMP[guild.id] = {
          POINTS: {}
        };
      } else {
        GUILD_CONFIGS[guild.id] = JSON.parse(data);
        checkGuildConfig(guild);
        GUILD_TEMP[guild.id] = {
          POINTS: {}
        };

        if (GUILD_CONFIGS[guild.id].GOOGLE_TOKEN) {
          // Guild has setup google auth, recreate the connection.
          if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
            loadSpreadsheet(guild).then(function (res) {
              return GUILD_TEMP[guild.id].POINTS = res;
            });
          }
        }
        /* if (GUILD_CONFIGS[guild.id].TWITCH_STREAMS.length) {
          // Guild has set up twitch stream watchers.
          createWebHooks(GUILD_CONFIGS[guild.id].TWITCH_STREAMS);
        } */

      }
    });
  });
}

function guildUpdate(guild, config) {
  _fs.default.writeFile(_path.default.resolve("./servers/".concat(guild.id, ".json")), JSON.stringify(config), function () {});

  GUILD_CONFIGS[guild.id] = config;
}

function stripCommand(message) {
  if (message && message.content) {
    return message.content.split(' ').slice(1).join(' ');
  } else {
    return '';
  }
}

function getPrefix(message) {
  var guildConfig = GUILD_CONFIGS[message.guild.id];
  return guildConfig && guildConfig.PREFIX ? guildConfig.PREFIX.toLowerCase() : constants.DEFAULT_PREFIX;
}

function extractAliases(commands) {
  var all = {};
  Object.keys(commands).forEach(function (command) {
    all[command] = commands[command];
    commands[command].aliases.forEach(function (alias) {
      all[alias] = _objectSpread({}, commands[command], {
        alias: true
      });
    });
  });
  return all;
}

function encodedStringArray(array) {
  return array.map(function (i) {
    return "`".concat(i, "`");
  }).join(', ');
}

function formatResponse(icon) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var icons = {
    pos: ':white_check_mark:',
    neg: ':x:'
  };
  return "".concat(icons[icon] ? icons[icon] : '', " ").concat(title ? "**".concat(title, "**") : '').concat(title && text ? ': ' : '').concat(text);
}

function createGoogleSheetsClient(guild) {
  var auth = new _googleapis.google.auth.OAuth2(CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, 'urn:ietf:wg:oauth:2.0:oob');
  auth.setCredentials(GUILD_CONFIGS[guild.id].GOOGLE_TOKEN);
  return _googleapis.google.sheets({
    version: 'v4',
    auth: auth
  });
}

function loadSpreadsheet(guild) {
  return new Promise(function (resolve, reject) {
    if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
      createGoogleSheetsClient(guild).spreadsheets.values.get({
        spreadsheetId: GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID,
        range: "".concat(GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME, "!A2:D"),
        valueRenderOption: 'FORMULA'
      }, function (err, res) {
        if (err) {
          reject(err.response && err.response.data && err.response.data.error && err.response.data.error.message ? err.response.data.error.message : 'Google sheets API error.');
        } else {
          var rows = res.data.values;

          if (rows && rows.length) {
            resolve(rows.map(function (row) {
              return {
                id: row[0],
                name: row[1],
                pointsFormula: row[2] || '=0',
                points: sheetFormulaTransform(row[2]),
                house: row[3] || ''
              };
            }).reduce(function (map, user) {
              map[user.id] = _objectSpread({}, user);
              return map;
            }, {}));
          } else {
            resolve({}); // Empty sheet.
          }
        }
      });
    } else {
      reject('Missing Google sheet variables.');
    }
  });
}

function updateSpreadsheet(guild) {
  return new Promise(function (resolve, reject) {
    if (GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME) {
      createGoogleSheetsClient(guild).spreadsheets.values.update({
        spreadsheetId: GUILD_CONFIGS[guild.id].GOOGLE_SHEET_ID,
        valueInputOption: 'USER_ENTERED',
        range: "".concat(GUILD_CONFIGS[guild.id].GOOGLE_SHEET_NAME, "!A2:D"),
        resource: {
          values: Object.entries(GUILD_TEMP[guild.id].POINTS).map(function (item) {
            return item[1];
          }) // Get value from key value pair.
          .sort(function (a, b) {
            return b.points - a.points;
          }) // Sort points
          .map(function (item) {
            return [// Format row.
            item.id, item.name, item.pointsFormula, item.house];
          })
        }
      }, function (err) {
        if (err) {
          reject(err.response && err.response.data && err.response.data.error && err.response.data.error.message ? err.response.data.error.message : 'Google sheets API error.');
        } else {
          resolve();
        }
      });
    } else {
      reject('Missing Google sheet variables.');
    }
  });
}

function sheetFormulaTransform(formula) {
  if (!formula) return 0;
  if (!isNaN(parseInt(formula, 10))) return formula; // Not a formula.

  return formula.substring(1) // Remove '='.
  .split('+') // Can only read formulas using nothing but plus.
  .reduce(function (add, num) {
    return add + parseInt(num, 10);
  }, 0); // Sum formula
}

function appendFormula(formula, number) {
  var newFormula = formula;
  if (!isNaN(parseInt(formula, 10))) newFormula = "=".concat(formula);
  return "".concat(newFormula, "+").concat(number);
}

function getUserPointsRow(guild, user) {
  return GUILD_TEMP[guild.id].POINTS[user.id] ? GUILD_TEMP[guild.id].POINTS[user.id] : {
    id: user.id,
    name: user.username,
    points: 0,
    pointsFormula: '=0'
  };
}

function checkReboot() {
  try {
    var _JSON$parse = JSON.parse(_fs.default.readFileSync('./reboot.json')),
        channelID = _JSON$parse.channel,
        time = _JSON$parse.time;

    CLIENT.channels.get(channelID).send("Rebooted! (took ".concat(parseFloat((new Date() - time) / 1000).toFixed(2), "s)"));

    _fs.default.unlink('./reboot.json', function () {});
  } catch (_) {
    _fs.default.unlink('./reboot.json', function () {});
  }
}

function isAdmin(message) {
  if (!GUILD_CONFIGS[message.guild.id].ADMINS.length) return true;
  return GUILD_CONFIGS[message.guild.id].ADMINS.indexOf(message.author.id) !== -1;
}

function checkGuildConfig(guild) {
  var changed = false;
  Object.keys(constants.EMPTY_GUILD_CONFIG).forEach(function (prop) {
    if (typeof GUILD_CONFIGS[guild.id][prop] === 'undefined') {
      changed = true;
      GUILD_CONFIGS[guild.id][prop] = constants.EMPTY_GUILD_CONFIG[prop];
    }
  });

  if (changed) {
    guildUpdate(guild, GUILD_CONFIGS[guild.id]);
  }
}
/*
export function twitchStatusChange(request) {
  console.log('Webhook hit, stream changed status');
}

export function createWebHooks(streamers) {
  let webhooks = 0;
  streamers.forEach(streamer => {
    request({
      method: 'POST',
      uri: `https://api.twitch.tv/helix/webhooks/hub`,
      headers: {
        'Client-ID': CONFIG.TWITCH_CLIENT_ID,
      },
      json: {
        'hub.mode': 'subscribe',
        'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${streamer.split('::')[1]}`,
        'hub.callback': `${CONFIG.HOST_URI}:${CONFIG.TWITCH_WEBHOOKS_PORT}/twitch`,
        'hub.lease_seconds': 86400 * 2, // 2 days while testing, up to 10 days later.
        // TODO Create a timeout refreshing webhook if bot is still up when lease expires.
      },
    }, (err, res) => {
      if (err) { return console.log(err); }
      if (res.statusCode === 202) {
        webhooks += 1;
      }
    });
  });

  // TODO Fix, needs to wait for all requests to finish..
  if (webhooks > 0) {
    console.log(`Created ${webhooks} Twitch webhooks.`);
  }
}

export function removeWebHook(streamer) {
  // TODO Unsubscribe from a single Twitch webhook.
}

export function destroyWebHooks() {
  // TODO Unsubscribe from all Twitch webhooks.
}
*/