'use strict';

angular.module('tasksApp')
  .controller('DbListCtrl', ['$scope', '$location', 'CouchDbServer',
    function ($scope, $location, CouchDbServer) {
      CouchDbServer.listAllDatabases().
        success(function (data) {
          $scope.databases = data;
        }).
        error(function () {
          $scope.databases = [];
        });

      $scope.newDb = function () {
        CouchDbServer.createDatabase($scope.dbName)
          .success(function () {
            $location.url('/view/' + $scope.dbName);
          })
          .error(function (data) {
            $scope.dbName = '';
            console.log(angular.toJson(data));
          })
      }
    }]);
