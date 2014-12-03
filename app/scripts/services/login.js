'use strict';

/**
 * @ngdoc service
 * @name tasksApp.Login
 * @description
 * # Login
 * Factory in the tasksApp.
 */
angular.module('tasksApp')
  .factory('Login', ['$q', '$location',
    function ($q, $location, $http) {
      return {
        request: function (config) {
          console.log(config);
          return true;
        },
        responseError: function (rejection) {
          console.log(rejection);
          return $q.reject(rejection);
        }
      };
    }]);
