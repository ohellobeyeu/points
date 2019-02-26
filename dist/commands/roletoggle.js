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

var usage = 'roleassign <role>';
exports.usage = usage;
var short = 'Give / Remove a self-assignable role on yourself';
exports.short = short;
var description = "Give / Remove a self-assignable role on yourself.\nName must be an extact case-insensitive match.";
exports.description = description;
var aliases = ['role', 'assignrole'];
exports.aliases = aliases;
var examples = ['roleassign Big guy'];
exports.examples = examples;
var group = 'utlity';
exports.group = group;

function run(_x) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(message) {
    var msg, role, member, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            msg = utils.stripCommand(message);
            role = message.guild.roles.find(function (role) {
              return role.name.toLowerCase() === msg.toLowerCase();
            });

            if (role) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", message.channel.send(utils.formatResponse('neg', '', "Found no role named `".concat(msg, "`."))));

          case 4:
            if (!(GUILD_CONFIGS[message.guild.id].SELF_ROLES.indexOf(role.name) === -1)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", message.channel.send(utils.formatResponse('neg', '', "The `".concat(role.name, "` role isn't self-assignable."))));

          case 6:
            _context.prev = 6;
            member = message.guild.members.find(function (member) {
              return member.user.id === message.author.id;
            });

            if (!member.roles.get(role.id)) {
              _context.next = 14;
              break;
            }

            _context.next = 11;
            return member.removeRole(role.id);

          case 11:
            message.channel.send(utils.formatResponse('pos', '', "You no longer have the `".concat(role.name, "` role **").concat(message.author.username, "**.")));
            _context.next = 17;
            break;

          case 14:
            _context.next = 16;
            return member.addRole(role.id);

          case 16:
            message.channel.send(utils.formatResponse('pos', '', "You now have the `".concat(role.name, "` role **").concat(message.author.username, "**.")));

          case 17:
            _context.next = 31;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](6);
            response = '';
            _context.t1 = _context.t0.message;
            _context.next = _context.t1 === 'Missing Access' ? 25 : _context.t1 === 'Missing Permissions' ? 27 : 29;
            break;

          case 25:
            response = "Missing `Manage roles` server permission.";
            return _context.abrupt("break", 30);

          case 27:
            response = "The `".concat(role.name, "` role is higher than my own so I can't assign it.");
            return _context.abrupt("break", 30);

          case 29:
            response = '**Unknown error:** ' + JSON.stringify(_context.t0);

          case 30:
            message.channel.send(utils.formatResponse('neg', '', response));

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[6, 19]]);
  }));
  return _run.apply(this, arguments);
}