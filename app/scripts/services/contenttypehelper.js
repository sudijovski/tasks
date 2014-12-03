'use strict';

/**
 * @ngdoc service
 * @name tasksApp.ContentTypeHelper
 * @description
 * # ContentTypeHelper
 * Factory in the tasksApp.
 */
angular.module('tasksApp')
  .factory('ContentTypeHelper', function () {
    return {
      getContentType: function (filename) {
        var types = {
          jpg: 'image/jpg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif'
        };
        var fileExtension = filename.split(".")[filename.split(".").length - 1];
        var result = types.hasOwnProperty(fileExtension) != undefined ?
          types[fileExtension] : 'application/octet-stream';
        return result;
      }
    };
  });
