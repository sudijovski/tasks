'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:UserHomeCtrl
 * @description
 * # UserHomeCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('UserHomeCtrl', ['$scope', '$location', '$rootScope', 'CouchDbDatabase', 'CouchDbServer',
    function ($scope, $location, $rootScope, CouchDbDatabase, CouchDbServer) {
      $scope.couchServerUrl = CouchDbServer.url();

      $scope.location = $location.path();

      $scope.linkClicked = function () {
        CouchDbDatabase.getDocument($rootScope.loggedInUser._id, 'users').success(function (data) {
          $scope.document = data;
          if (data._attachments) {
            $scope.avatarUrl = CouchDbServer.url() + 'users/' + data._id + '/' + Object.keys(data._attachments)[0];
          }
        });
      };

      $scope.deleteDoc = function () {
        CouchDbDatabase.deleteDocument($scope.document, 'users').then(function () {
          var path = $location.path();
        })
      };

      $scope.updateDoc = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.document, 'users').success(function () {
          delete $scope.document;
        });
      };

      $scope.uploadFile = function () {
        delete $scope.document._attachments;
        CouchDbDatabase.createOrUpdateDocument($scope.document, 'users').success(function () {
          CouchDbDatabase.getDocument($scope.document._id, 'users').success(function (data) {
            $scope.document = data;
            CouchDbDatabase.uploadAttachment($scope.document, 'users', $scope.$$childTail.file).success(function () {
              CouchDbDatabase.getDocument($scope.document._id, 'users').success(function (data) {
                $scope.document = data;
              });
            });
          });
        });
      }
    }]);
