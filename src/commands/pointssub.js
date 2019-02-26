"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var usage = 'pointssub <number>';
exports.usage = usage;
var short = 'Remove / view your own points.';
exports.short = short;
var description = "Remove some of your own points or check how many you have.";
exports.description = description;
var aliases = ['sub', 'minus', 'subtract'];
exports.aliases = aliases;
var examples = ['pointssub 5'];
exports.examples = examples;
var group = 'points';
exports.group = group;

function run(message) {
  if (!GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID || !GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_NAME) {
    message.channel.send(utils.formatResponse('neg', 'Missing setup', "The variables `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_NAME` must be set in order to use a spreadsheet. See `".concat(utils.getPrefix(message), "key` command.")));
  }

  var msg = utils.stripCommand(message);
  var userRow = utils.getUserPointsRow(message.guild, message.author);

  if (!msg || msg === '0') {
    return message.channel.send("You have **".concat(userRow.points, "** points, ").concat(message.author.username, "."));
  }

  var number = parseInt(msg, 10);

  if (isNaN(number)) {
    return message.channel.send(utils.formatResponse('neg', '', "`".concat(msg, "` isn't a number.")));
  }

  var newPoints = number > userRow.points ? 0 : userRow.points - number;
  userRow.name = message.author.username;
  userRow.pointsFormula = utils.appendFormula(userRow.pointsFormula, "-".concat(newPoints ? number : userRow.points));
  userRow.points = newPoints;
  GUILD_TEMP[message.guild.id].POINTS[message.author.id] = userRow;
  utils.updateSpreadsheet(message.guild).then(function () {
    return message.channel.send(utils.formatResponse('pos', '', "".concat(message.author.username, ": **-").concat(number, "**! Total: **").concat(userRow.points, "**.")));
  }).catch(function (err) {
    return message.channel.send(utils.formatResponse('neg', 'Failed saving', err));
  });
}