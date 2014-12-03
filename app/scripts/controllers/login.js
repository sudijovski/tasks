'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('LoginCtrl', ['$scope', '$location', '$rootScope', 'CouchDbDatabase',
    function ($scope, $location, $rootScope, CouchDbDatabase) {
      $scope.login = function () {
        CouchDbDatabase.getDocument($scope.user.username, 'users')
          .success(function (data) {
            if (data.password == $scope.user.password) {
              $rootScope.loggedInUser = data;
              $location.path('/');
            } else {
              onError();
            }
          })
          .error(function (data) {
            onError();
          });
      };

      $scope.userNameFocused = function () {
        delete $scope.error;
      };

      function onError() {
        $scope.user.username = '';
        $scope.user.password = '';
        $scope.error = 'Invalid credentials';
      }
    }]);
