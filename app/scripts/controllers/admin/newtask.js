'use strict';

/**
 * @ngdoc function
 * @name tasksApp.controller:AdminNewtaskCtrl
 * @description
 * # AdminNewtaskCtrl
 * Controller of the tasksApp
 */
angular.module('tasksApp')
  .controller('AdminNewTaskCtrl', ['$scope', '$location', 'CouchDbDatabase', 'TaskStatus', 'TaskType',
    function ($scope, $location, CouchDbDatabase, TaskStatus, TaskType) {
      var paths = $location.path().split("/");
      var docId = paths[paths.length - 3];
      $scope.task = {};
      $scope.taskTypes = TaskType.types();
      $scope.taskType = $scope.taskTypes[0];

      CouchDbDatabase.getDocuments('users')
        .success(function (data) {
          $scope.assignees = data.rows;
          $scope.task.assignee = $scope.assignees[0];
        });

      CouchDbDatabase.view('tasks', 'byProject', {keys: [docId]})
        .success(function (data) {
          $scope.task._id = docId.toUpperCase().replace(/\s/g, "-") + '-' + (data.rows.length + 1);
        });

      $scope.createTask = function () {
        var document = {project: docId};
        document._id = $scope.task._id;
        document.name = $scope.task.name;
        document.type = $scope.taskType;
        document.shortDesc = $scope.task.shortDesc;
        document.assignee = $scope.task.assignee.id;
        document.status = TaskStatus.statuses()[0];
        document.comments = [];
        CouchDbDatabase.createOrUpdateDocument(document, 'tasks')
          .success(function () {
            var path = $location.path();
            $location.path(path.substring(0, path.indexOf('/newtask')));
          });
      };
    }]);
