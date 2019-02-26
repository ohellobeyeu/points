"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

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

var usage = 'reboot';
exports.usage = usage;
var short = 'Update and reboot the bot.';
exports.short = short;
var description = "Checks for updates, rebuilds the project and finally kills the bot process with hopes of pm2 restarting it.";
exports.description = description;
var aliases = ['boot', 'restart', 'kill'];
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
  regeneratorRuntime.mark(function _callee3(message) {
    var msg;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (utils.isAdmin(message)) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return", message.channel.send(utils.formatResponse('neg', 'Unauthorized', 'Only admins can use this command.')));

          case 2:
            _context3.next = 4;
            return message.channel.send('Checking for updates ...');

          case 4:
            msg = _context3.sent;
            (0, _child_process.exec)('git fetch && git reset --hard origin/master',
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(err) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (err) {
                          _context2.next = 4;
                          break;
                        }

                        _context2.next = 3;
                        return msg.edit('Building ...');

                      case 3:
                        (0, _child_process.exec)('yarn build',
                        /*#__PURE__*/
                        function () {
                          var _ref2 = _asyncToGenerator(
                          /*#__PURE__*/
                          regeneratorRuntime.mark(function _callee(err) {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    if (err) {
                                      _context.next = 4;
                                      break;
                                    }

                                    _context.next = 3;
                                    return msg.edit('Rebooting ...');

                                  case 3:
                                    _fs.default.writeFile(_path.default.resolve('./reboot.json'), JSON.stringify({
                                      channel: msg.channel.id,
                                      time: +new Date()
                                    }), function () {
                                      process.exit(1);
                                    });

                                  case 4:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee, this);
                          }));

                          return function (_x3) {
                            return _ref2.apply(this, arguments);
                          };
                        }());

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x2) {
                return _ref.apply(this, arguments);
              };
            }());

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _run.apply(this, arguments);
}