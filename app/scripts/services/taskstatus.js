'use strict';

/**
 * @ngdoc service
 * @name tasksApp.TaskStatus
 * @description
 * # TaskStatus
 * Factory in the tasksApp.
 */
angular.module('tasksApp')
  .factory('TaskStatus', function () {
    var statuses = [
      'Opened',
      'In Progress',
      'Resolved',
      'Can Not Fix'
    ];

    return {
      statuses: function () {
        return statuses;
      }
    };
  });
