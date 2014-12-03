'use strict';

angular.module('tasksApp')
  .controller('DocumentListCtrl', ['$scope', '$location', 'CouchDbDatabase', 'CouchDbServer',
    function ($scope, $location, CouchDbDatabase, CouchDbServer) {
      var paths = $location.path().split("/");
      var database = paths[paths.length - 1];
      var type = database == 'users' ?
        'User' : 'Project';
      $scope.database = database;
      $scope.location = $location.path();
      $scope.documentType = type;

      getDocuments();

      $scope.linkClicked = function (documentId, newDocument) {
        if (newDocument) {
          $scope.document = {};
          $scope.type = 'new-' +  type.toLowerCase();
          return;
        }
        $scope.type = type.toLowerCase();
        CouchDbDatabase.getDocument(documentId, database).success(function (data) {
          $scope.document = data;
          if (data._attachments) {
            $scope.avatarUrl = CouchDbServer.url() + database + '/' +
            data._id + '/' + Object.keys(data._attachments)[0];
          } else {
            delete $scope.avatarUrl;
          }
        });
      };

      $scope.deleteDoc = function () {
        CouchDbDatabase.deleteDocument($scope.document, database).then(function () {
          delete $scope.type;
          delete $scope.document;
          getDocuments();
        })
      };

      $scope.updateDoc = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.document, database).success(function () {
          delete $scope.type;
          $scope.document = {};
          getDocuments();
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
                getDocuments();
              });
            });
          });
        });
      };

      function getDocuments() {
        CouchDbDatabase.getDocuments($scope.database).success(function (data) {
          $scope.documents = data;
        });
      }
    }]);
