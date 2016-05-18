var mongoose = require('mongoose');
var fs = require('fs-extra');
var path = require('path');
var multiPart = require('connect-multiparty');
var multiPartMiddleWare = multiPart();

var Post = mongoose.model('Post', {
  text: {
    type: String,
    default: ''
  },
  img: {
    type: String
  }

})

var Posts = mongoose.model('Posts', {
  text: {
    type: String,
    default: ''
  },
  img: {
    data: Buffer,
    contentType: String
  }
})

function gatherPosts(res) {
  // using mongoose to retrieve all posts in database
  Post.find({}, function(err, post) {
    // if its an err retrieving, send err
    if (err) {
      res.send(err);
    }
    // send posts in JSON format
    res.json(post);
  })
};

function uploadPhoto(req, res) {
  var file = req.files.file;
  console.log(file);

  var uploadDate = new Date();
  var tempPath = file.path;
  var targetPath = path.join("./uploads/" + uploadDate + file.name);

  fs.rename(tempPath, targetPath, function (err) {
    if (err) {
      console.log("Error uploading");
    } else {
      console.log("Success")
    }
  });
};
module.exports = function (app) {

  app.get('/api/blogposts', function (req, res) {
    gatherPosts(res);
  });
  app.use(multiPartMiddleWare);
 // app.post('/api/blogposts', multiPartMiddleWare, uploadPhoto);
  app.post('/api/blogposts', function (req, res) {

    if (req.files == undefined) {
      Post.create({
        text: req.body.text,
      }, function (err, post) {
        if (err)
          res.send(err);

        gatherPosts(res);
      });
    } else {
      app.post('/api/blogposts', multiPartMiddleWare, function (req, res) {
        var file = req.files.file;
        console.log(file);

        var uploadDate = new Date();
        var tempPath = file.path;
        var targetPath = path.join("./uploads/" + uploadDate + file.name);

        fs.rename(tempPath, targetPath, function (err) {
          if (err) {
            console.log("Error uploading");
          } else {
            console.log("Success")
          }
        });
      });
      console.log('hey')
      Post.create({
        text: req.body.text,
        img: req.files.file.name
      }, function (err, post) {
        if (err)
          res.send(err);

        gatherPosts(res);
      });
    }
  });

  app.delete('/api/blogposts/:post_id', function (req, res) {
    Post.remove({
      _id: req.params.post_id
    }, function (err, post) {
      if (err)
        res.send(err);

      gatherPosts(res);
    });
  });
};
