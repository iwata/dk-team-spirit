# What's this?

Headless Chromeを使ってTeam Spiritsの打刻を実行する

# Requirements

- Node 8+
 - Yarn
- Chrome 59+

# Usage

## Create Config

```sh
$ git clone {this repository}
$ cd dk-team-Spirits
$ yarn install
$ vim config/default.json
```

Edit like this:
```json
{
  "url": "htts://login-page-for-team-spirits",
  "username": "your-username@example.com",
  "password": "your-pass"
}
```

## Execute

```sh
$ npm start
# done
```

- 出社前であれば出社ボタンを押し、出社後であれば退社ボタンを押す
- `tmp`以下にScreen Shotをいくつか出力する
