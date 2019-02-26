"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.group = exports.examples = exports.aliases = exports.description = exports.short = exports.usage = void 0;

var pkg = require('../../package.json');

var usage = 'source';
exports.usage = usage;
var short = 'View my source code.';
exports.short = short;
var description = "Prints a link to the project repository hosting the full source code for this project.";
exports.description = description;
var aliases = ['github'];
exports.aliases = aliases;
var examples = [];
exports.examples = examples;
var group = 'utlity';
exports.group = group;

function run(message) {
  message.channel.send("Project source code: __".concat(pkg.homepage, "__"));
}