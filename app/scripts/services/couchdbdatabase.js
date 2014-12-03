'use strict';

angular.module('tasksApp')
  .factory('CouchDbDatabase', ['$http', 'CouchDbServer', 'ContentTypeHelper',
    function ($http, CouchDbServer, ContentTypeHelper) {
      return {
        getDocument: function (document, database) {
          return $http({
            method: 'GET',
            url: CouchDbServer.url() + database + '/' + document
          });
        },
        deleteDocument: function (document, database) {
          return $http({
            method: 'DELETE',
            url: CouchDbServer.url() + database + '/' + document._id,
            params: {
              rev: document._rev
            }
          });
        },
        getDocuments: function (database) {
          return $http({
            method: 'GET',
            url: CouchDbServer.url() + database + '/_all_docs'
          })
        },
        createOrUpdateDocument: function (document, database) {
          return $http({
            method: 'PUT',
            url: CouchDbServer.url() + database + '/' + document._id,
            data: document
          })
        },
        uploadAttachment: function (document, database, attachment) {
          return $http({
            method: 'PUT',
            url: CouchDbServer.url() + database + '/' + document._id + '/' + attachment.name,
            data: attachment,
            params: {
              rev: document._rev
            },
            headers: {
              'Content-Type': ContentTypeHelper.getContentType(attachment.name)
            }
          })
        },
        getInfo: function (database) {
          return $http({
            method: 'GET',
            url: CouchDbServer.url() + database
          })
        },
        view: function (database, name, data) {
          return $http({
            method: 'POST',
            url: CouchDbServer.url() + database + '/_design/' + database + '/_view/' + name,
            data: data
          })
        }
      };
    }]);
