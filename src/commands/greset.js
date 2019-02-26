"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var usage = 'greset';
exports.usage = usage;
var short = 'Remove Google authentication.';
exports.short = short;
var description = 'Delete established Google authentication.';
exports.description = description;
var aliases = ['googlereset', 'reset'];
exports.aliases = aliases;
var examples = [];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

  if (GUILD_CONFIGS[message.guild.id].GOOGLE_TOKEN) {
    var newConfig = GUILD_CONFIGS[message.guild.id];
    delete newConfig['GOOGLE_TOKEN'];
    utils.guildUpdate(message.guild, newConfig);
    message.channel.send(utils.formatResponse('pos', '', 'Google authentication deleted.'));
  } else {
    message.channel.send(utils.formatResponse('neg', '', 'No Google authentication exists.'));
  }
}