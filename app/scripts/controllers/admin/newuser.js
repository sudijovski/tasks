'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:AdminNewuserCtrl
 * @description
 * # AdminNewuserCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('AdminNewUserCtrl', ['$scope', '$location', 'CouchDbDatabase',
    function ($scope, $location, CouchDbDatabase) {
      $scope.project = {};

      $scope.createUser = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.user, 'users')
          .success(function () {
            var path = $location.path();
            $location.path(path.substring(0, path.indexOf('/new')));
          })
      }
    }]);
