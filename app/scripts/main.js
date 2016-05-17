angular.module('PostApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/next', {
        url: '/next',
        templateUrl: 'try.html',
        controller: 'mainController'
      })
      .when('/', {
        url: '/',
        templateUrl: 'blog.html',
        controller: 'secondController'
      })
  })
  .controller('mainController', ['$scope', '$http', 'Posts', function($scope, $http, Posts) {
  $scope.post = {};

  Posts.get()
    .success(function(data) {
      $scope.posts = data;
      console.log($scope.post)
    });

  $scope.addPost= function () {
    if ($scope.post.text != undefined) {
      Posts.create($scope.post)

            .success(function(data) {
              $scope.post = {};
              $scope.posts = data;
            });
      }
    };

  $scope.deletePost= function(id) {
    Posts.delete(id)
            .success(function (data) {
              $scope.posts = data;
            });
  }
}])
  .controller('secondController', ['$scope', '$http', 'Posts', function($scope, $http, Posts) {
    $scope.hots = {};

    Posts.get()
      .success(function(data) {
        $scope.hosts = data;
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
