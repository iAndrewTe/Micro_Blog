angular.module('PostApp')
    .factory('Posts', ['$http', function($http) {
      return {
        get: function() {
          return $http.get('/api/blogposts');
        },
        create: function(postData) {
          return $http.post('/api/blogposts', postData);
        },
        delete: function(id) {
          return $http.delete('/api/blogposts/' + id);
        }
      }
    }]);
