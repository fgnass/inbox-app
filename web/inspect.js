var remote = require('electron').remote;

var pos = null;
var menu = new remote.Menu();

menu.append(new remote.MenuItem({
  label: 'Inspect element',
  click: function() {
    remote.getCurrentWindow().inspectElement(pos.x, pos.y);
  }
}));

window.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  pos = { x: e.x, y: e.y };
  menu.popup(remote.getCurrentWindow(), e.x, e.y);
});
