"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

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

var pkg = require('../../package.json');

var usage = 'stats';
exports.usage = usage;
var short = 'General bot statistics.';
exports.short = short;
var description = "Check if the bot is responsive and get some general statistics.";
exports.description = description;
var aliases = ['ping'];
exports.aliases = aliases;
var examples = [];
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
    var upS, upM, upH, upD, msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            upS = Math.ceil(CLIENT.uptime / 1000 % 60).toString().padStart(2, '0');
            upM = Math.floor(CLIENT.uptime / 1000 % (60 * 60) / 60).toString().padStart(2, '0');
            upH = Math.floor(CLIENT.uptime / 1000 % (60 * 60 * 24) / (60 * 60)).toString().padStart(2, '0');
            upD = Math.floor(CLIENT.uptime / 1000 / (60 * 60 * 24));
            _context.next = 6;
            return message.channel.send('Statistics\n==========', {
              code: 'asciidoc'
            });

          case 6:
            msg = _context.sent;
            msg.edit("\nStatistics\n==========\n- Version      -  v".concat(pkg.version, "\n- Uptime       -  ").concat(upD, " day").concat(upD != 1 ? 's' : '', ", ").concat(upH, ":").concat(upM, ":").concat(upS, "\n- Latency      -  ").concat(msg.createdTimestamp - message.createdTimestamp, " ms\n- API Latency  -  ").concat(Math.round(CLIENT.ping), " ms\n- Mem usage    -  ").concat(parseFloat(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), " MB\n- Servers      -  ").concat(CLIENT.guilds.size.toString(), "\n- Channels     -  ").concat(CLIENT.channels.size.toString(), "\n- Users        -  ").concat(CLIENT.users.size.toString(), "\n"), {
              code: 'asciidoc'
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _run.apply(this, arguments);
}