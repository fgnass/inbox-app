# Google Inbox packaged as electron app

This is a very thin wrapper around the Google Inbox web interface built with
[electron](http://electron.atom.io/).

It loads https://inbox.google.com and injects a small script that
sends `document.getElementsByClassName('ss').length;` to the main process once
per second. That value is used to display an _unread messages_ badge in the
OS X dock.

![screenshot](screenshot.png)

## Building

```
npm install
npm run pack-osx
cp -r Inbox-darwin-x64/Inbox.app /Applications
```
