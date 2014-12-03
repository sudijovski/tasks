'use strict';

/**
 * @ngdoc overview
 * @name tasksApp
 * @description
 * # tasksApp
 *
 * Main module of the application.
 */
angular
  .module('tasksApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/admin/', {
        templateUrl: 'views/admin/home.html'
      })
      .when('/admin/:database', {
        controller: 'DocumentListCtrl',
        templateUrl: 'views/documentlist.html'
      })
      .when('/admin/projects/new', {
        controller: 'AdminNewProjectCtrl',
        templateUrl: 'views/admin/newproject.html'
      })
      .when('/admin/projects/:document', {
        controller: 'DocumentCtrl',
        templateUrl: 'views/admin/viewproject.html'
      })
      .when('/admin/projects/:document/tasks', {
        controller: 'AdminTaskListCtrl',
        templateUrl: 'views/admin/tasklist.html'
      })
      .when('/admin/projects/:document/tasks/newtask', {
        controller: 'AdminNewTaskCtrl',
        templateUrl: 'views/admin/newtask.html'
      })
      .when('/admin/projects/:document/tasks/:task', {
        controller: 'ViewTaskCtrl',
        templateUrl: 'views/admin/viewtask.html'
      })
      .when('/admin/projects/:document/tasks/:task', {
        controller: 'ViewTaskCtrl',
        templateUrl: 'views/admin/viewtask.html'
      })
      .when('/admin/users/new', {
        controller: 'AdminNewUserCtrl',
        templateUrl: 'views/admin/newuser.html'
      })
      .when('/admin/users/:document', {
        controller: 'DocumentCtrl',
        templateUrl: 'views/admin/viewuser.html'
      })
      .when('/user/', {
        controller: 'UserHomeCtrl',
        templateUrl: 'views/user/home.html'
      })
      .when('/user/tasks', {
        controller: 'UserMyTasksCtrl',
        templateUrl: 'views/user/mytasks.html'
      })
      .when('/user/tasks/:task', {
        controller: 'ViewTaskCtrl',
        templateUrl: 'views/user/viewtask.html'
      })
      .when('/user/myprofile', {
        controller: 'UserHomeCtrl',
        templateUrl: 'views/user/myprofile.html'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'views/login.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if ($rootScope.loggedInUser == null) {
        $location.path('/login');
      } else if ($rootScope.loggedInUser.isAdmin) {
        var path = $location.path();
        path = path.indexOf('/admin') == 0 ?
          path : '/admin' + path;
        $location.path(path);
      } else {
        var path = $location.path();
        path = path.indexOf('/user') == 0 ?
          path : '/user' + path;
        $location.path(path);
      }
    })
  });
