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
  },
  blog_id: {
    type: String,
    default: ''
  }
});

function sendPosts(req,res) {
  // using mongoose to retrieve all posts in database
  if (req.body.blog_id != undefined) {
    Post.find({blog_id: req.body.blog_id}, function (err, post) {
      // if its an err retrieving, send err
      if (err) {
        res.send(err);
      }
      // send posts in JSON format
      res.send(post);
    })
  }
};

function uploadPhoto(req, res) {
  var file = req.files.file;
  console.log(file);

  var uploadDate = new Date();
  var tempPath = file.path;
  var targetPath = path.join("./app/images/" + uploadDate + file.name);
  var savedPath = "images/" + uploadDate + file.name;

  fs.rename(tempPath, targetPath, function (err) {
    if (err) {
      console.log("Error uploading");
    } else {
      console.log("Success")
    }
  });

  return savedPath;
};
module.exports = function (app) {

  app.get('/api/blogposts', function (req, res) {
    sendPosts(req, res);

  });

  app.use(multiPartMiddleWare);
  app.post('/api/blogposts', function (req, res) {

    if (req.files == undefined) {
      Post.create({
        text: req.body.text,
        blog_id: req.body.blog_id
      }, function (err, post) {
        if (err)
          res.send(err);

        sendPosts(req, res);
      });
    } else {
      var picturePath = uploadPhoto(req, res); // upload image with post
      Post.create({
        text: req.body.text,
        img: picturePath,
        blog_id: req.body.blog_id
      }, function (err, post) {
        if (err)
          res.send(err);

        sendPosts(req, res);
      });
    };
  });

  app.delete('/api/blogposts/:post_id', function (req, res) {
     Post.remove({
      _id: req.params.post_id
    }, function (err, post) {
      if (err)
        res.send(err);

       Post.find(function(err, post) {
         if (err)
          res.send(err);

         res.send(post);
       })
    });
     });
};
