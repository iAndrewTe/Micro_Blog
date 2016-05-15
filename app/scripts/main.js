angular.module('PostApp')
  .controller('mainController', ['$scope', '$http', 'Posts', function($scope, $http, Posts) {
  $scope.post = {},

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
}]);
