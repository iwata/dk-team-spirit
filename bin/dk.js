#!/usr/bin/env node

"use strict";

const {run}  = require("../src/cli.js");
const config = require('config');
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const optionDefinitions = [
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
  },
  {
    name: 'screenshot',
    alias: 's',
    type: Boolean,
  },
  {
    name: 'in',
    type: Boolean,
  },
  {
    name: 'out',
    type: Boolean,
  },
];

const options = commandLineArgs(optionDefinitions);
if (options.help) {
  const usage = getUsage([
    {
      header: 'Usage: toggle enter or leave office',
      content: './bin/dk.js [-v|--verbose] [-s|--screenshot]'
    },
    {
      header: 'Enter your office',
      content: './bin/dk.js [-v|--verbose] [-s|--screenshot] --in'
    },
    {
      header: 'Leave your office',
      content: './bin/dk.js [-v|--verbose] [-s|--screenshot] --out'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'screenshot|s',
          description: '[Optional] write screenshots into a tmp dir'
        },
        {
          name: 'in',
          description: '[Optional] enter your office'
        },
        {
          name: 'out',
          description: '[Optional] leave your office'
        },
        {
          name: 'help|h',
          description: 'Print this usage guide.'
        },
      ]
    }
  ]);
  console.info(usage);
  return;
}


(async () => {
  run({
    url: config.get('url'),
    username: config.get('username'),
    password: config.get('password'),
  }, options);
})();
