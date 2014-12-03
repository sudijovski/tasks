'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:AdminTasklistCtrl
 * @description
 * # AdminTasklistCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('AdminTaskListCtrl', ['$scope', '$location', '$rootScope', 'CouchDbDatabase', 'CouchDbServer', 'TaskStatus', 'TaskType',
    function ($scope, $location, $rootScope, CouchDbDatabase, CouchDbServer, TaskStatus, TaskType) {
      var paths = $location.path().split("/");
      var docId = paths[paths.length - 2];
      var database = paths[paths.length - 1];

      $scope.docId = docId;
      $scope.location = $location.path();

      CouchDbDatabase.view(database, 'byProject', {keys: [docId]})
        .success(updateModel);

      function updateModel(data) {
        delete $scope.newtask;
        delete $scope.task;
        delete $scope.tasks;
        $scope.tasks = data.rows;
      }

      $scope.newTask = function () {
        delete $scope.task;
        $scope.task = {};
        $scope.types = TaskType.types();

        $scope.task.type = $scope.types[0];

        CouchDbDatabase.getDocuments('users')
          .success(function (data) {
            $scope.assignees = data.rows;
            $scope.task.assignee = $scope.assignees[0];
            CouchDbDatabase.view('tasks', 'byProject', {keys: [docId]})
              .success(function (data) {
                $scope.task._id = docId.toUpperCase().replace(/\s/g, "-") + '-' + (data.rows.length + 1);
              });
          });

        $scope.newtask = true;
      };

      $scope.couchServerUrl = CouchDbServer.url();
      $scope.linkClicked = function (taskId) {
        delete $scope.newtask;
        CouchDbDatabase.getDocuments('users')
          .success(function (data) {
            $scope.assignees = [];
            for (var index = 0; index < data.rows.length; index++) {
              $scope.assignees.push(data.rows[index].id);
            }
            CouchDbDatabase.getDocument(taskId, 'tasks')
              .success(function (data) {
                $scope.task = data;
                $scope.types = TaskType.types();
                $scope.statuses = TaskStatus.statuses();
              });
          });
      };

      $scope.updateTask = function () {
        if (!$scope.task) {
          $scope.task = $scope.$$childTail.task;
        }
        CouchDbDatabase.createOrUpdateDocument($scope.task, 'tasks')
          .success(function () {
            CouchDbDatabase.view(database, 'byProject', {keys: [docId]})
              .success(updateModel);
          });
      };

      $scope.createTask = function () {
        $scope.createTask = function () {
          var document = {project: docId};
          document._id = $scope.task._id;
          document.name = $scope.task.name;
          document.type = $scope.task.type;
          document.shortDesc = $scope.task.shortDesc;
          document.assignee = $scope.task.assignee.id;
          document.status = TaskStatus.statuses()[0];
          document.comments = [];
          CouchDbDatabase.createOrUpdateDocument(document, 'tasks')
            .success(function () {
              CouchDbDatabase.view(database, 'byProject', {keys: [docId]})
                .success(updateModel);
            });
        };
      };

      $scope.uploadFile = function () {
        CouchDbDatabase.uploadAttachment($scope.task, 'tasks', $scope.$$childTail.attachment).success(function () {
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
          CouchDbDatabase.view(database, 'byProject', {keys: [docId]})
            .success(updateModel);
        });
      };

      $scope.comment = function () {
        console.log($scope.$$childTail.commentModel);
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
