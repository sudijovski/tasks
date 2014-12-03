'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:ViewTaskCtrl
 * @description
 * # ViewTaskCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('ViewTaskCtrl', ['$scope', '$location', '$rootScope', 'CouchDbDatabase', 'CouchDbServer', 'TaskStatus', 'TaskType',
    function ($scope, $location, $rootScope, CouchDbDatabase, CouchDbServer, TaskStatus, TaskType) {
      var paths = $location.path().split("/");
      var docId = paths[paths.length - 1];
      $scope.couchServerUrl = CouchDbServer.url();
      CouchDbDatabase.getDocuments('users')
        .success(function (data) {
          $scope.assignees = [];
          for (var index = 0; index < data.rows.length; index++) {
            $scope.assignees.push(data.rows[index].id);
          }
          CouchDbDatabase.getDocument(docId, 'tasks')
            .success(function (data) {
              $scope.task = data;
              $scope.types = TaskType.types();
              $scope.statuses = TaskStatus.statuses();
            });
        });

      $scope.updateTask = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.task, 'tasks')
          .success(function () {
            CouchDbDatabase.getDocument($scope.task._id, 'tasks')
              .success(function (data) {
                $scope.task = data;
              });
          });
      };

      $scope.uploadFile = function () {
        CouchDbDatabase.uploadAttachment($scope.task, 'tasks', $scope.file).success(function () {
          delete $scope.file;
          CouchDbDatabase.getDocument(docId, 'tasks')
            .success(function (data) {
              $scope.task = data;
            });
        });
      };

      $scope.deleteAttachment = function (key) {
        delete $scope.task._attachments[key];
      };

      $scope.deleteComment = function (index) {
        $scope.task.comments.splice(index, 1);
      };

      $scope.deleteTask = function () {
        CouchDbDatabase.deleteDocument(angular.fromJson($scope.task), 'tasks').success(function () {
          var path = $location.path();
          $location.path(path.substring(0, path.indexOf('/' + $scope.task._id)));
        })
      };

      $scope.comment = function () {
        $scope.task.comments.push({text: $scope.commentModel, from: $rootScope.loggedInUser.fullName});
        $scope.commentModel = '';
      };
    }]);
