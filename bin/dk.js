#!/usr/bin/env node

"use strict";

const {run}  = require("../src/cli.js");
const config = require('config');

(async () => {
  run({
    url: config.get('url'),
    username: config.get('username'),
    password: config.get('password'),
    verbose: true,
  });
})();
