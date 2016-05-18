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
  $scope.addPost= function () {
    if ($scope.post.text != undefined && $scope.post.img != undefined) {
      $scope.upload($scope.post.img, $scope.post.text)
      $scope.post = {};

      } else if ($scope.post.img == undefined) {
        console.log('present!');
        Posts.create($scope.post)
          .success(function(data) {

          $scope.post = {};
          $scope.posts = data;
        });
    }
    };

  $scope.upload = function (file, text) {
      Upload.upload({
        url: '/api/blogposts',
        data: {file: file, text: text}
      }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };


  $scope.deletePost= function(id) {
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
