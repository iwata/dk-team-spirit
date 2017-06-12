"use strict";

const process = require('process');
const fs      = require('fs');
const {promisify} = require('util');
const writeFileAsync = promisify(fs.writeFile);
const Chromy  = require('chromy');

process.on('SIGINT', async () => {
  await Chromy.cleanup();
  throw new Error('user canceled');
});

let chromy;

module.exports.run = async ({url, username, password}, opt) => {
  try {
    let png;
    chromy = await login({url, username, password});
    console.info('Logged in');
    if (opt.screenshot) {
      png = await chromy.screenshot();
      await writeFileAsync('./tmp/logged-in.png', png);
    }

    const iframeUrl = await chromy.evaluate(() => {
        // 打刻widgetが存在するiframe
        return document.querySelector('iframe[title="AtkWorkComponent"]').src;
    });
    await chromy.goto(iframeUrl);

    // 各ボタンが非同期に有効化されるのでそれまで待つ
    await chromy.wait(() => {
      return document.querySelector('.pw_jumpex');
    });

    if (opt.verbose) {
      console.info('Go to a widget page');
    }
    if (opt.screenshot) {
      png = await chromy.screenshot();
      await writeFileAsync('./tmp/widget.png', png);
    }

    // 出社済みかどうか
    const hasEntered = await chromy.evaluate(() => {
      return document.querySelector('.pw_btnnst_dis');
    });
    // 退社済みかどうか
    const hasLeft = await chromy.evaluate(() => {
      return document.querySelector('.pw_btnnet_dis');
    });

    if (opt.in) {
      if (hasEntered) {
        throw new Error('You have already entered');
      } else {
        await enter();
      }
    } else if (opt.out) {
      if (hasLeft) {
        throw new Error('You have already left');
      } else {
        await leave();
      }
    } else if (hasEntered) {
      await leave();
    } else {
      await enter();
    }

    await chromy.sleep(1000);
    if (opt.screenshot) {
      png = await chromy.screenshot();
      await writeFileAsync('./tmp/complete.png', png);
    }

    await chromy.close();
    console.info('Finished!');
  } catch (e) {
    console.error(e);
    await chromy.close();
  }
};

async function login({url, username, password}) {
  const chromy = new Chromy({visible: false});
  await chromy.goto(url);
  await chromy.insert('#username', username);
  await chromy.insert('#password', password);
  await chromy.click('#Login', {waitLoadEvent: true});
  await chromy.waitLoadEvent();
  return chromy;
}

// 出社
async function enter() {
  await chromy.click('#btnStInput');
  console.info('Entered office');
}

// 退社
async function leave() {
  await chromy.click('#btnEtInput');
  console.info('Left office');
}
