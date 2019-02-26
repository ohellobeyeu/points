"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var _discord = _interopRequireDefault(require("discord.js"));

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

var usage = 'uinfo <user>';
exports.usage = usage;
var short = 'Info about a user.';
exports.short = short;
var description = "Get some general info about a user or yourself.";
exports.description = description;
var aliases = ['user', 'avatar'];
exports.aliases = aliases;
var examples = ['uinfo', 'uinfo @warau'];
exports.examples = examples;
var group = 'utlity';
exports.group = group;

function run(message) {
  var msg = utils.stripCommand(message);
  var member = msg ? message.mentions.members.first() : message.guild.members.find(function (member) {
    return member.user.id === message.author.id;
  });
  message.channel.send({
    embed: new _discord.default.RichEmbed().setColor('#000000'.replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    })).setThumbnail(member.user.avatarURL ? member.user.avatarURL : null).setAuthor("".concat(member.user.tag, " (").concat(member.id, ")"), member.user.avatarURL ? member.user.avatarURL : null).addField('Nickname:', member.nickname ? member.nickname : 'No nickname', true).addField('Playing', "".concat(member.user.presence.game ? "".concat(member.user.presence.game.name) : 'not playing anything.'), true).addField('Bot', "".concat(member.user.bot ? 'Yes' : 'No'), true).addField('Roles', "".concat(member.roles.filter(function (r) {
      return r.id !== message.guild.id;
    }).map(function (r) {
      return "`".concat(r.name, "`");
    }).join(' **|** ') || 'No Roles'), true).addField('Joined server', "".concat(member.joinedAt.toDateString()), true).addField('Joined Discord', "".concat(member.user.createdAt.toDateString()), true)
  });
}