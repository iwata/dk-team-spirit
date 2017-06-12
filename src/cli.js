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

module.exports.run = async ({url, username, password, verbose = false}) => {
  try {
    let png;
    const chromy = await login({url, username, password});
    console.info('Logged in');
    if (verbose) {
      png = await chromy.screenshot();
      await writeFileAsync('./tmp/logged-in.png', png);
    }

    const iframeUrl = await chromy.evaluate(() => {
        // 打刻widgetが存在するiframeのID
        return document.getElementById('06610000000KOf2').src;
    });
    await chromy.goto(iframeUrl);

    // 各ボタンが非同期に有効化されるのでそれまで待つ
    await chromy.wait(() => {
      return document.querySelector('.pw_jumpex');
    });
    console.info('Go to a widget page');
    if (verbose) {
      png = await chromy.screenshot();
      await writeFileAsync('./tmp/widget.png', png);
    }

    // 出社済みかどうか
    const hasEntered = await chromy.evaluate(() => {
      return document.querySelector('.pw_btnnst_dis');
    });

    if (hasEntered) {
      // 退社
      await chromy.click('#btnEtInput');
      console.info('Left office');
    } else {
      // 出社
      await chromy.click('#btnStInput');
      console.info('Entered office');
    }

    await chromy.sleep(1000);
    if (verbose) {
      png = await chromy.screenshot();
      await writeFileAsync('./tmp/complete.png', png);
    }

    await chromy.close();
    console.info('Completed');
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
