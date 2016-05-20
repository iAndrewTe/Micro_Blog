angular.module('PostApp', ['ngRoute', 'ngFileUpload'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/gameBlog', {
                url: '/gameBlog',
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
         .success(function (data) {
           $scope.posts = data;
           for ();
         });

     $scope.addPost= function (blog_id) {
            $scope.post.blog_id = blog_id;
            if ($scope.post.title && $scope.post.text && $scope.post.img) {

                Upload.upload({
                  url: '/api/blogposts',
                  data: {
                    title: $scope.post.title,
                    text: $scope.post.text,
                    blog_id: blog_id
                  },
                  file: $scope.post.img
                  }).then(function (res) {
                      console.log('hey');
                      $scope.post = {};
                      $scope.posts = res.data;
                      console.log(res);
                    }, function (res) {
                      console.log('Error status: ' + res.status);
                    }, function (evt) {
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
            } else if ($scope.post.title && $scope.post.text) {
                Posts.create($scope.post)
                    .success(function(data) {
                        $scope.post = {};
                        $scope.posts = data;
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
