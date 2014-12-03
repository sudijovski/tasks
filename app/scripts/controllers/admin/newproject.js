'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:AdminNewprojectCtrl
 * @description
 * # AdminNewprojectCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('AdminNewProjectCtrl', ['$scope', '$location', 'CouchDbDatabase',
    function ($scope, $location, CouchDbDatabase) {
      $scope.project = {};

      $scope.createProject = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.project, 'projects')
          .success(function () {
            var path = $location.path();
            $location.path(path.substring(0, path.indexOf('/new')));
          })
      }
    }]);
