"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var utils = _interopRequireWildcard(require("../utils"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var usage = 'admin <user>';
exports.usage = usage;
var short = 'List / Add / remove bot admins.';
exports.short = short;
var description = 'Give or remove a user\'s access to admin commands. Emit user to get a list of all admins.';
exports.description = description;
var aliases = ['admins'];
exports.aliases = aliases;
var examples = ['admin', 'admin @warau'];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  var member = message.mentions.members.first();

  if (!member) {
    if (GUILD_CONFIGS[message.guild.id].ADMINS.length) {
      return message.channel.send(":triangular_flag_on_post: **Admins:**\n".concat(GUILD_CONFIGS[message.guild.id].ADMINS.map(function (member) {
        return "`".concat(message.guild.members.get(member).user.username, "`");
      }).join(' **|** ')));
    }

    return message.channel.send(utils.formatResponse('neg', '', 'There are no admins.'));
  }

  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));

  if (GUILD_CONFIGS[message.guild.id].ADMINS.indexOf(member.id) !== -1) {
    utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
      ADMINS: GUILD_CONFIGS[message.guild.id].ADMINS.filter(function (i) {
        return i !== member.id;
      })
    }));
    message.channel.send(utils.formatResponse('pos', '', "**".concat(member.user.username, "** is no longer an admin.")));
  } else {
    utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
      ADMINS: _toConsumableArray(GUILD_CONFIGS[message.guild.id].ADMINS).concat([member.id])
    }));
    message.channel.send(utils.formatResponse('pos', '', "**".concat(member.user.username, "** added to admins.")));
  }
}