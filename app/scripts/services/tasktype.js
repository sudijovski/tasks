'use strict';

/**
 * @ngdoc service
 * @name tasksApp.TaskType
 * @description
 * # TaskType
 * Factory in the tasksApp.
 */
angular.module('tasksApp')
  .factory('TaskType', function () {
    var types = [
      'Feature',
      'User Story',
      'Bug',
      'Change Request'
    ];

    return {
      types: function () {
        return types;
      }
    };
  });
