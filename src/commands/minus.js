"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var usage = 'pointstake <user> <number>';
exports.usage = usage;
var short = 'Take some some points from someone.';
exports.short = short;
var description = "Take some points from another user.";
exports.description = description;
var aliases = ['take'];
exports.aliases = aliases;
var examples = ['pointstake @warau 5'];
exports.examples = examples;
var group = 'points';
exports.group = group;

function run(message) {
  if (!GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_ID || !GUILD_CONFIGS[message.guild.id].GOOGLE_SHEET_NAME) {
    message.channel.send(utils.formatResponse('neg', 'Missing setup', "The variables `GOOGLE_SHEET_ID` and `GOOGLE_SHEET_NAME` must be set in order to use a spreadsheet. See `".concat(utils.getPrefix(message), "key` command.")));
  }

  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));
  var msg = utils.stripCommand(message);
  var msgSplit = msg.split(' ');

  if (msgSplit.length !== 2) {
    return message.channel.send(utils.formatResponse('neg', 'Invalid input', "Please check your command. Refer to `".concat(utils.getPrefix(message), "help` for the correct syntax.")));
  }

  if (!message.mentions.members.first()) {
    return message.channel.send(utils.formatResponse('neg', 'Invalid user', "Could not find the user `".concat(msgSplit[0], "`. Please use their tag.")));
  }

  var user = message.mentions.members.first().user;
  var userRow = utils.getUserPointsRow(message.guild, user);
  var number = parseInt(msgSplit[1], 10);

  if (isNaN(number)) {
    return message.channel.send(utils.formatResponse('neg', '', "`".concat(msg, "` isn't a number.")));
  }

  var newPoints = number > userRow.points ? 0 : userRow.points - number;
  userRow.name = user.username;
  userRow.pointsFormula = utils.appendFormula(userRow.pointsFormula, "-".concat(newPoints ? number : userRow.points));
  userRow.points = newPoints;
  GUILD_TEMP[message.guild.id].POINTS[user.id] = userRow;
  utils.updateSpreadsheet(message.guild).then(function () {
    return message.channel.send(utils.formatResponse('pos', '', "".concat(user.username, ": **-").concat(number, "**đ! Số tiền đang có: **").concat(userRow.points, "**đ.")));
  }).catch(function (err) {
    return message.channel.send(utils.formatResponse('neg', 'Failed saving', err));
  });
}