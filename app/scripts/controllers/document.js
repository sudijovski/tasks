'use strict';

angular.module('tasksApp')
  .controller('DocumentCtrl', ['$scope', '$location', '$rootScope', 'CouchDbDatabase', 'CouchDbServer',
    function ($scope, $location, $rootScope, CouchDbDatabase, CouchDbServer) {
      var paths = $location.path().split("/");
      var docId = paths[paths.length - 1];
      var database = paths[paths.length - 2];
      $scope.couchServerUrl = CouchDbServer.url();
      if ($rootScope.loggedInUser.isAdmin == false) {
        docId = $rootScope.loggedInUser._id;
        database = 'users';
      }

      $scope.location = $location.path();
      CouchDbDatabase.getDocument(docId, database).success(function (data) {
        $scope.document = data;
        if (data._attachments) {
          $scope.avatarUrl = CouchDbServer.url() + 'users/' + data._id + '/' + Object.keys(data._attachments)[0];
        }
      });

      $scope.deleteDoc = function () {
        CouchDbDatabase.deleteDocument($scope.document, database).then(function () {
          var path = $location.path();
        })
      };

      $scope.updateDoc = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.document, database).success(function () {
          CouchDbDatabase.getDocument(docId, database).success(function (data) {
            $scope.document = data;
          });
        });
      };

      $scope.uploadFile = function () {
        delete $scope.document._attachments;
        CouchDbDatabase.createOrUpdateDocument($scope.document, database).success(function () {
          CouchDbDatabase.getDocument($scope.document._id, database).success(function (data) {
            $scope.document = data;
            CouchDbDatabase.uploadAttachment($scope.document, 'users', $scope.file).success(function () {
              CouchDbDatabase.getDocument($scope.document._id, database).success(function (data) {
                $scope.document = data;
              });
            });
          });
        });
      }
    }]);
