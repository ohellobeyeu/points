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

var usage = 'roleedit <role>';
exports.usage = usage;
var short = 'List / Add / remove self-assignable roles.';
exports.short = short;
var description = 'Add or remove a role from the list of self-assignable roles. Emit role to get a list of all self-assignable roles.\nName must be an extact case-insensitive match.';
exports.description = description;
var aliases = ['roles', 'selfroles', 'editrole'];
exports.aliases = aliases;
var examples = ['roleedit', 'roleedit Big guy'];
exports.examples = examples;
var group = 'settings';
exports.group = group;

function run(message) {
  var msg = utils.stripCommand(message);

  if (!msg) {
    if (!GUILD_CONFIGS[message.guild.id].SELF_ROLES.length) {
      return message.channel.send(utils.formatResponse('neg', '', 'there are no self-assignable roles.'));
    } else {
      return message.channel.send(":pushpin: **Self-assignable roles:**\n".concat(GUILD_CONFIGS[message.guild.id].SELF_ROLES.map(function (role) {
        return "`".concat(role, "`");
      }).join(' **|** ')));
    }
  }

  if (!utils.isAdmin(message)) return message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.'));
  var role = message.guild.roles.find(function (role) {
    return role.name.toLowerCase() === msg.toLowerCase();
  });

  if (!role) {
    return message.channel.send(utils.formatResponse('neg', '', "Found no role named `".concat(msg, "`.")));
  }

  if (GUILD_CONFIGS[message.guild.id].SELF_ROLES.indexOf(role.name) !== -1) {
    utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
      SELF_ROLES: GUILD_CONFIGS[message.guild.id].SELF_ROLES.filter(function (i) {
        return i.toLowerCase() !== role.name.toLowerCase();
      })
    }));
    message.channel.send(utils.formatResponse('pos', '', "`".concat(role.name, "` is no longer a self-assignable role.")));
  } else {
    if (role.position >= message.guild.me.highestRole.position) {
      return message.channel.send(utils.formatResponse('neg', '', "The `".concat(role.name, "` role is higher than my own so I can't assign it.")));
    }

    utils.guildUpdate(message.guild, _objectSpread({}, GUILD_CONFIGS[message.guild.id], {
      SELF_ROLES: _toConsumableArray(GUILD_CONFIGS[message.guild.id].SELF_ROLES).concat([role.name])
    }));
    message.channel.send(utils.formatResponse('pos', '', "`".concat(role.name, "` added to self-assignable roles.")));
  }
}