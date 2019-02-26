"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var usage = 'leaderboard <count>';
exports.usage = usage;
var short = 'View all the points.';
exports.short = short;
var description = "Either prints the link to the spreadsheet or top X / all users.";
exports.description = description;
var aliases = ['scores', 'leaderboard', 'leaderboards', 'top'];
exports.aliases = aliases;
var examples = ['leaderboard', 'leaderboard 5', 'leaderboard all'];
exports.examples = examples;
var group = 'points';
exports.group = group;

function run(message) {
  var msg = utils.stripCommand(message);

  if (!GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID) {
    message.channel.send(utils.formatResponse('neg', 'Missing setup', "The `GOOGLE_SHEET_ID` variable must be set. See `".concat(utils.getPrefix(message), "key` command.")));
    return;
  }

  if (!GUILD_TEMP[message.guild.id].POINTS || !Object.keys(GUILD_TEMP[message.guild.id].POINTS).length) {
    message.channel.send(utils.formatResponse('neg', "The leaderboard is empty."));
    return;
  }

  var response = ':trophy: **Houses Leaderboard**:\n';

  if (!msg) {
    message.channel.send("".concat(response, "__https://docs.google.com/spreadsheets/d/").concat(GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID, "__"));
  } else if (msg === 'all') {
    Object.keys(GUILD_TEMP[message.guild.id].POINTS).sort(function (a, b) {
      return GUILD_TEMP[message.guild.id].POINTS[b].points - GUILD_TEMP[message.guild.id].POINTS[a].points;
    }).forEach(function (key, index) {
      if (GUILD_TEMP[message.guild.id].POINTS.hasOwnProperty(key)) {
        response += "**#".concat(index + 1, "** ").concat(GUILD_TEMP[message.guild.id].POINTS[key].name, ": **").concat(GUILD_TEMP[message.guild.id].POINTS[key].points, "**\n");
      }
    });
    message.channel.send(response);
  } else if (!isNaN(parseInt(msg, 10))) {
    Object.keys(GUILD_TEMP[message.guild.id].POINTS).sort(function (a, b) {
      return GUILD_TEMP[message.guild.id].POINTS[b].points - GUILD_TEMP[message.guild.id].POINTS[a].points;
    }).filter(function (_, index) {
      return index < parseInt(msg, 10);
    }).forEach(function (key, index) {
      if (GUILD_TEMP[message.guild.id].POINTS.hasOwnProperty(key)) {
        response += "**#".concat(index + 1, "** ").concat(GUILD_TEMP[message.guild.id].POINTS[key].name, ": **").concat(GUILD_TEMP[message.guild.id].POINTS[key].points, "**\n");
      }
    });
    message.channel.send(response);
  } else {
    message.channel.send(utils.formatResponse('neg', 'Invalid input', "Please check your command. Refer to `".concat(utils.getPrefix(message), "help` for the correct syntax.")));
  }
}