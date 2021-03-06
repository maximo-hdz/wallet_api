'use strict';

angular.module('pantallasAdministradorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTable',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
       .when('/main', {
        templateUrl: 'views/mainAccount.html',
        controller: 'MainAccountCtrl'
      })
       .when('/detail/:phoneId', {
        templateUrl: 'views/detail.html',
        controller: 'detailCtrl'
      })
       .when('/leaderboard', {
        templateUrl: 'views/leaderboard.html',
        controller: 'LeaderBoardCtrl'
      })
      .when('/websockets', {
        templateUrl: 'views/webSocket.html'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
