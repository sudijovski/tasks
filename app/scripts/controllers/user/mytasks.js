'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:UserMytasksCtrl
 * @description
 * # UserMytasksCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('UserMyTasksCtrl', ['$scope', '$location', '$rootScope', 'CouchDbDatabase', 'CouchDbServer', 'TaskStatus', 'TaskType',
    function ($scope, $location, $rootScope, CouchDbDatabase, CouchDbServer, TaskStatus, TaskType) {
      $scope.location = $location.path();

      CouchDbDatabase.view('tasks', 'byAssignee', {keys: [$rootScope.loggedInUser._id]})
        .success(updateModel);

      function updateModel(data) {
        $scope.tasks = data.rows;
      }


      $scope.linkClicked = function (docId) {
        delete $scope.task;
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
      };

      $scope.updateTask = function () {
        CouchDbDatabase.createOrUpdateDocument($scope.task, 'tasks')
          .success(function () {
            delete $scope.task;
            delete $scope.commentModel;
          });
      };

      $scope.uploadFile = function () {
        CouchDbDatabase.uploadAttachment($scope.task, 'tasks', $scope.$$childTail.file).success(function () {
          $scope.$$childTail.file;
          CouchDbDatabase.getDocument($scope.task._id, 'tasks')
            .success(function (data) {
              $scope.task = data;
            });
        });
      };

      $scope.deleteAttachment = function (key) {
        delete $scope.task._attachments[key];
        CouchDbDatabase.createOrUpdateDocument($scope.task, 'tasks')
          .success(function () {
            CouchDbDatabase.getDocument($scope.task._id, 'tasks')
              .success(function (data) {
                $scope.task = data;
              });
          });
      };

      $scope.deleteComment = function (index) {
        $scope.task.comments.splice(index, 1);
        CouchDbDatabase.createOrUpdateDocument($scope.task, 'tasks')
          .success(function () {
            CouchDbDatabase.getDocument($scope.task._id, 'tasks')
              .success(function (data) {
                $scope.task = data;
              });
          });
      };

      $scope.deleteTask = function () {
        CouchDbDatabase.deleteDocument($scope.task, 'tasks').success(function () {
          delete $scope.task;
          CouchDbDatabase.view('tasks', 'byAssignee', {keys: [$rootScope.loggedInUser._id]})
            .success(updateModel);
        })
      };

      $scope.comment = function () {
        $scope.task.comments.push({text: $scope.$$childTail.commentModel, from: $rootScope.loggedInUser.fullName});
        $scope.$$childTail.commentModel = '';
        CouchDbDatabase.createOrUpdateDocument($scope.task, 'tasks')
          .success(function () {
            CouchDbDatabase.getDocument($scope.task._id, 'tasks')
              .success(function (data) {
                $scope.task = data;
              });
          });
      };
    }]);
