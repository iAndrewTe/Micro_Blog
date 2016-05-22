angular.module('PostApp', ['ngRoute', 'ngFileUpload'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/:blog_id', {
                url: '/gameBlog',
                templateUrl: 'GameBlog.html',
                controller: 'mainController',
            })
            .when('/', {
                url: '/',
                templateUrl: 'MicroBlog.html',
                controller: 'mainController'
            });


    })
    .controller('mainController', ['$scope', '$http', 'Posts', 'Upload', '$routeParams', function($scope, $http, Posts, Upload, $routeParams) {
        $scope.post = {};

        function collectPosts(data) {
            var blog = $routeParams.blog_id;
            if (blog == undefined)
                blog = "micro_blog";

            var blogposts = [];

            for (var i =0; i < data.length; i++) {
                if (data[i].blog_id == blog)
                    blogposts.push(data[i]);
            }
            $scope.posts = blogposts;
        };

       Posts.get()
         .success(function (data) {
            collectPosts(data);
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
                      $scope.post = {};
                      collectPosts(res.data);
                    }, function (res) {
                      console.log('Error status: ' + res.status);
                    }, function (evt) {
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
            } else if ($scope.post.title && $scope.post.text) {
                Posts.create($scope.post)
                    .success(function(data) {
                        collectPosts(data);
                    });
            }
        };

        $scope.deletePost = function(id, blog_id) {
            Posts.delete(id)
                .success(function (data) {
                    collectPosts(data);
                });
        };

    }]);
