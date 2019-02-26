"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var utils = _interopRequireWildcard(require("./utils"));

var admin = _interopRequireWildcard(require("./commands/admin"));

var gauth = _interopRequireWildcard(require("./commands/gauth"));

var greload = _interopRequireWildcard(require("./commands/greload"));

var greset = _interopRequireWildcard(require("./commands/greset"));

var help = _interopRequireWildcard(require("./commands/help"));

var key = _interopRequireWildcard(require("./commands/key"));

var leaderboard = _interopRequireWildcard(require("./commands/leaderboard"));

var sotien = _interopRequireWildcard(require("./commands/sotien"));

var plus = _interopRequireWildcard(require("./commands/plus"));

var pointssub = _interopRequireWildcard(require("./commands/pointssub"));

var minus = _interopRequireWildcard(require("./commands/minus"));

var prefix = _interopRequireWildcard(require("./commands/prefix"));

var reboot = _interopRequireWildcard(require("./commands/reboot"));

var roleedit = _interopRequireWildcard(require("./commands/roleedit"));

var roletoggle = _interopRequireWildcard(require("./commands/roletoggle"));

var source = _interopRequireWildcard(require("./commands/source"));

var stats = _interopRequireWildcard(require("./commands/stats"));

var uinfo = _interopRequireWildcard(require("./commands/uinfo"));

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
} // import * as twitch from './commands/twitch';


var _default = utils.extractAliases({
  admin: admin,
  gauth: gauth,
  greload: greload,
  greset: greset,
  help: help,
  key: key,
  leaderboard: leaderboard,
  sotien: sotien,
  plus: plus,
  pointssub: pointssub,
  minus: minus,
  prefix: prefix,
  reboot: reboot,
  roleedit: roleedit,
  roletoggle: roletoggle,
  source: source,
  stats: stats,
  // twitch,
  uinfo: uinfo
});

exports.default = _default;