express-anti-leech
==================

Anti leech for express website.

What is Leech?
-----------

Direct linking (or hot-linking) is a form of bandwidth leeching that occurs when placing an unauthorized linked object, often an image, from one site in a web page belonging to a second site (the leech).

Leech (computing) wiki
http://en.wikipedia.org/wiki/Leech_(computing)

Install
-----------
<code>npm install express-anti-leech</code>

Example
-----------

    var express = require('express'),
      path = require('path'),
      app = express();
    
    var AntiLeech = require('express-anti-leech');
    
    // white list
    var hosts = ['localhost', 'localhost:8004'];
    
    // filter type
    var exts = ['.png', '.jpg', '.jpeg', '.gif', '.swf', '.flv'];
    
    // default show picture
    var pictrue = "/images/default.png";
    
    app.use(AntiLeech({
      allow: hosts,
      exts: exts,
      log: console.log, // you can use your own
      default: pictrue
    }));
    
    // keep AntiLeech before use static
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('port', process.env.PORT || 8004);
    
    app.get('/', function(req, res) {
      res.redirect("/index.html");
    });
    
    app.listen(app.get('port'), function() {
      console.log("Express test server listening on http://localhost:" + app.get('port'));
    });
