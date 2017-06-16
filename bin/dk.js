#!/usr/bin/env node

"use strict";

const {exec}      = require('child_process');
const {promisify} = require('util');
const execAsync   = promisify(exec);

const {run}           = require('../src/cli.js');
const config          = require('config');
const commandLineArgs = require('command-line-args');
const getUsage        = require('command-line-usage');

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
  {
    name: 'interface',
    alias: 'i',
    type: String,
    defultValue: 'en0',
  },
  {
    name: 'wifi',
    type: String,
    multiple: true,
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
      header: 'WIFI WATCH MODE: if you connected specific SSID, it consider that you entered office',
      content: './bin/dk.js [-v|--verbose] [-s|--screenshot] --wifi DEV-NET [-i|--interface={en0}]'
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
          name: 'wifi',
          description: '[Optional, Multiple] set some SSIDs'
        },
        {
          name: 'interface|i',
          description: '[Optional] network interface name to search wifi SSID'
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

async function getSSID(interf) {
  const {stdout} = await execAsync(`/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport ${interf} -I |grep " SSID:" |tr -d " " |cut -d: -f 2`);
  return stdout.trim();
}

(async () => {
  if (options.wifi) {
    const ssid = await getSSID(options.interface);
    if (!options.wifi.includes(ssid)) {
      console.info(`${ssid} is not included`);
      return;
    }
    // 出社として処理する
    options.in = true;
    options.out = false;
  }

  await run({
    url: config.get('url'),
    username: config.get('username'),
    password: config.get('password'),
  }, options);
})();
