var Movie = require('../model/movie');
var express = require('express');
var router = express.Router();
var Transfer = require('./Transfer');
var fs = require('fs');

router.route('/movies').get(function(req, res) {
	console.log(req.url);
  Movie.find(function(err, movies) {
    if (err) {
      return res.send(err);
    }
    //res.json(movies);
	res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
	var str = JSON.stringify(movies); 
	res.write(str);
	res.end();
  });
});

router.route('/movies').post(function(req, res) {
	console.log(req.query);
	var movie = new Movie({title:req.query.title,
		releaseYear:req.query.releaseYear,director:req.query.director,genre:req.query.genre});
  movie.save(function(err) {
    if (err) {
      return res.send(err);
    }
	
    //res.send({ message: 'Movie Added' });
	res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
	res.write('Movie Added');
	res.end();
  });
});

router.route('/movies')
  .get(function(req, res) {
    Movie.find(function(err, movies) {
      if (err) {
        return res.send(err);
      }
 
      res.json(movies);
    });
  })
  .post(function(req, res) {
    var movie = new Movie(req.body);
 
    movie.save(function(err) {
      if (err) {
        return res.send(err);
      }
 
      res.send({ message: 'Movie Added' });
    });
  });
  
  router.route('/movies/:id').put(function(req,res){
  Movie.findOne({ _id: req.params.id }, function(err, movie) {
    if (err) {
      return res.send(err);
    }
 
    for (prop in req.body) {
      movie[prop] = req.body[prop];
    }
 
    // save the movie
    movie.save(function(err) {
      if (err) {
        return res.send(err);
      }
 
      res.json({ message: 'Movie updated!' });
    });
  });
});
router.route('/movies/:id').get(function(req, res) {
  /*Movie.findOne({ _id: req.params.id}, function(err, movie) {
    if (err) {
	  console.log('wei error');
      return res.send(err);
    }
 
    res.json(movie);
  });*/
  //console.log(__dirname);
  //res.download(__dirname + '/uExamCmd.pas');
  
  var transfer = new Transfer(req, res);
    var filePath = './cpp11.rar';
	filename = 'cpp11.rar';
	console.log('start file');
	
	fs.exists(filePath, function(exist) {
        if(exist) {
			res.setHeader('Content-Disposition', 'attachment; filename='+encodeURIComponent(filename));
			transfer.Download(filePath);
        } 
		else {
			console.log('not exist');
			res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
			res.write('not exitst');
			res.end();
        }
    });   
  
});

router.route('/movies/:id').delete(function(req, res) {
	console.log(req.params);
  Movie.remove({
    _id: req.params.id
  }, function(err, movie) {
    if (err) {
      return res.send(err);
    }
 
    res.json({ message: 'Successfully deleted' });
  });
});

module.exports = router;