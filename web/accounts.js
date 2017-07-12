var qsa = require('./qsa');
console.log(window.location.pathname);
if (window.location.pathname == '/u/0/') {
  qsa('a[class=gb_Fb][href*=authuser]').forEach(function(a) {
    console.log('Opening account', a.href);
    window.open(a.href);
  });
}
