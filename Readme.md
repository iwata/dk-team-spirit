# What's this?

Headless Chromeを使ってTeam Spiritsの打刻を実行する

# Requirements

- Node 8+
 - Yarn
- Chrome 59+

# Setup and usage

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

## Usage

```sh
$ ./bin/dk.js -h
$ ./bin/dk.js
```
