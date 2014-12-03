'use strict';

angular.module('tasksApp')
  .factory('CouchDbServer', ['$http',
    function ($http) {
      var url = 'http://localhost:5984/';
      return {
        url: function () {
          return url;
        },
        listAllDatabases: function () {
          return $http({
            method: 'GET',
            url: url + '_all_dbs'
          });
        },
        createDatabase: function (databaseName) {
          return $http({
            method: 'PUT',
            url: url + databaseName
          })
        },
        deleteDatabase: function (databaseName) {
          return $http({
            method: 'DELETE',
            url: url + databaseName
          })
        }
      };
    }]);
