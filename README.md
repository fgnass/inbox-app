# Google Inbox packaged as Electron app

This is a thin wrapper around the Google Inbox web interface built on
[Electron](http://electron.atom.io/).

![screenshot](screenshot.png)

## Features

* Native desktop notifications
* Unread messages badge in OS X dock
* Native spell checking
* Dark sidebar theme

## Download

You can download a binary version for OS X here: [Inbox.app.zip](https://github.com/fgnass/inbox-app/releases/download/v1.0.0/Inbox.app.zip
)

## Building

```
npm install
npm run pack-osx
cp -r Inbox-darwin-x64/Inbox.app /Applications
```

Inbox.app currently only works on OS X although adding support for Windows and Linux shouldn't be that hard. Pull requests welcome!


# Disclaimer

This project is not affiliated with, associated to, nor endorsed by Google
in any way. Google, Inbox by Gmail and the Google Inbox Logo are registered
trademarks of Google Inc.

The code in this repository has been released to the public domain
under the [UNLICENSE](./UNLICENSE).
