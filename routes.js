var mongoose = require('mongoose');
var Post = mongoose.model('Post', {
  text: {
    type: String,
    default: ''
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

module.exports = function (app) {

  app.get('/api/blogposts', function (req, res) {
    gatherPosts(res);
  });

  app.post('/api/blogposts', function (req, res) {

    Post.create({
      text: req.body.text
    }, function (err, post) {
      if (err)
        res.send(err);

      gatherPosts(res);
    });

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
