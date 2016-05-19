angular.module('PostApp', ['ngRoute', 'ngFileUpload'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/next', {
        url: '/next',
        templateUrl: 'GameBlog.html',
        controller: 'mainController'
      })
      .when('/', {
        url: '/',
        templateUrl: 'blog.html',
        controller: 'mainController'
      })
  })
  .controller('mainController', ['$scope', '$http', 'Posts', 'Upload', function($scope, $http, Posts, Upload) {
  $scope.post = {};

  Posts.get()
    .success(function(data) {
      $scope.posts = data;
    });

  $scope.addPost= function (blog_id) {
    $scope.post.blog_id = blog_id;
      if ($scope.post.text != undefined && $scope.post.img != undefined) {
        $scope.upload($scope.post.img, $scope.post.text, blog_id);

      } else if ($scope.post.text != undefined) {
        Posts.create($scope.post)
          .success(function(data) {
          $scope.post = {};
          $scope.posts = data;
        });
    }
    };

  $scope.upload = function (file, text, blog_id) {
      Upload.upload({
          url: '/api/blogposts',
          data: {text: text, blog_id: blog_id},
          file: file
      }).then(function (res) {
          $scope.post = {};
          $scope.posts = res.data;
      }, function (res) {
          console.log('Error status: ' + res.status);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      })
    };


  $scope.deletePost = function(id) {
      Posts.delete(id)
          .success(function (data) {
              $scope.posts = data;
          });
  }

}])
   /**
    .controller('secondController', ['$scope', '$http', 'Posts', function($scope, $http, Posts) {
    $scope.post = {};

    Posts.get()
      .success(function(data) {
        $scope.posts = data;
      });

    $scope.addPost = function () {
      if ($scope.hots.text != undefined) {
        Posts.create($scope.hots)
          .success(function(data) {
            $scope.hots = {};
            $scope.hosts = data;
          });
      }
    };

    $scope.deletePost = function(id) {
      Posts.delete(id)
        .success(function (data) {
          $scope.posts = data;
        });
    };

  }]);
    **/
