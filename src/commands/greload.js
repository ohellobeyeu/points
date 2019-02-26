"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var usage = 'greload';
exports.usage = usage;
var short = 'Reload Google sheet.';
exports.short = short;
var description = 'Reload the spreadsheet data. Use this if you manually edit the spreadsheet.';
exports.description = description;
var aliases = ['googlereload', 'reload'];
exports.aliases = aliases;
var examples = [];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  if (!GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
    return message.channel.send(utils.formatResponse('neg', 'Missing authentication', "Run `".concat(utils.getPrefix(message), "gauth` to setup Google authentication.")));
  }

  if (GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID && GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_NAME) {
    utils.loadSpreadsheet(message.guild).then(function (res) {
      GUILD_TEMP[message.guild.id].POINTS = res;
      message.channel.send('Points reloaded. :sparkles:');
    }).catch(function (err) {
      return message.channel.send(utils.formatResponse('neg', 'Failed reloading', err));
    });
  } else {
    message.channel.send(utils.formatResponse('neg', 'Missing setup', "The variables `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_NAME` must be set in order to use a spreadsheet. See `".concat(utils.getPrefix(message), "key` command.")));
  }
}