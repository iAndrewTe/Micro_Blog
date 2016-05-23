angular.module('PostApp', ['ngRoute', 'ngFileUpload'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/login', {
              url: '/login',
              templateUrl: 'LoginPage.html',
              controller: 'mainController'
            })
            .when('/micro_blog', {
                url: '/micro_blog',
                templateUrl: 'MicroBlog.html',
                controller: 'mainController'
            })
            .when('/game_blog', {
                url: '/game_blog',
                templateUrl: 'GameBlog.html',
                controller: 'mainController'
            })
            .otherwise({
                redirectTo: '/login'
            })
    })
    .controller('mainController', ['$scope', '$http', 'Posts', 'Authenticate','Upload', '$routeParams', '$location',
                            function($scope, $http, Posts, Authenticate, Upload, $routeParams, $location) {
        $scope.$watch(Authenticate, function () {
            $scope.currentUser = Authenticate.currentUser();
            $scope.loggedIn = Authenticate.isLoggedIn;
        });
        $scope.user = {};
        $scope.post = {};
        $scope.error = false;
        var accountExists = function (data, userName, passWord)  {
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == userName && data[i].password == passWord)
                    return true;
            }
            return false;
        };

        var userExist = function (data, userName) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == userName)
                    return true;
            }
            return false;
        };

        $scope.setError = function () {
            $scope.error = false;
            $scope.user.name = '';
            $scope.user.password = '';
        }
        $scope.checkUser = function (userName, passWord) {
            $http.get('/microblog/users').success(function (data) {
                if (userName == undefined || passWord == undefined){
                } else if (!userExist(data, userName)) {
                    Authenticate.setCurrentUser(userName);
                    $scope.error = false;
                    Posts.createUser($scope.user);
                    $location.path('/micro_blog');
                } else {
                    // ALERT THAT USER EXIST
                    $scope.error = true;
                }
            });
        };

        $scope.authenticate = function (userName, passWord) {
            $http.get('/microblog/users').success(function (data) {
                if (userName == undefined || passWord == undefined){}
                else if (accountExists(data, userName, passWord)) {
                    Authenticate.setCurrentUser(userName);
                    Authenticate.isLoggedIn = true;
                    $scope.error = false;
                    $location.path('/micro_blog');
                } else {
                    // ALERT THAT USER DOES NOT EXIST
                    $scope.error = true;
                }
            });
        };

        $scope.logOut = function () {
            Authenticate.isLoggedIn = false;
            Authenticate.setCurrentUser('Guest');
        };

        function collectPosts(data) {
            var blog_id = $location.path().replace('/', '');
            var blogposts = [];
            for (var i =0; i < data.length; i++) {
                if (data[i].blog_id == blog_id)
                    blogposts.push(data[i]);
            }
            $scope.post = {};
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
                    blog_id: blog_id,
                    user: Authenticate.currentUser()
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
                $scope.post.user = Authenticate.currentUser();
                Posts.create($scope.post)
                    .success(function(data) {
                        collectPosts(data);
                    });
            }
        };

        $scope.deletePost = function(id) {
            Posts.delete(id)
                .success(function (data) {
                    collectPosts(data);
                });
        };
    }]);
