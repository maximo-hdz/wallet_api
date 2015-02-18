'use strict';

angular.module('pantallasAdministradorApp')
.controller('LeaderBoardCtrl', ['$scope', '$rootScope', '$location','$http','$filter', 'ngTableParams','$timeout',function ($scope, $rootScope, $location ,$http , $filter, ngTableParams,$timeout){
  var dataset;

  var socket = io.connect('http://walletdemoapidevelopmen-tejxxmen4e.elasticbeanstalk.com');
  socket.on('connect', function(){
      socket.emit('adduser', 6666);
  });

  socket.on('update_event', function (payload) {
    console.log('Incoming Message');
      $http({
          url: '/api/leaderboard',
          method: 'GET',
      }).
        success(function(data, status, headers) {
          dataset = data;
          $scope.tableParams.reload();
      }).
        error(function(data, status) {
          $scope.errorMessage = data.message;
      });
    });


   $scope.tableParams = new ngTableParams({
       page: 1, // show first page
       count: 10, // count per page
       sorting: {
           name: 'asc' // initial sorting
       }
   }, {
       total: function () {
           return dataset.length;
       }, // length of data
       getData: function ($defer, params) {
          $timeout(function() {
                // update table params
                console.log('inside timeout')
                if(dataset){
                  params.total(dataset.users.length);
                  //params.settings({ counts: data.length > 10 ? [10, 25, 50] : []});
                  $defer.resolve(dataset.users);
                }
            }, 500);
        },
       $scope: {
           $data: {}
       }
   });

  /*$scope.init = function () {
      $http({
          url: '/api/leaderboard',
          method: 'GET',
      }).
        success(function(data, status, headers) {
          dataset = data;
          $scope.tableParams = new ngTableParams({
              page: 1,
              count: 10,
              sorting: {
                  dox: 'asc'
              }
          }, {
              total: data.users.length,
              getData: function($defer, params) {

                  $timeout(function() {
                      // update table params
                      console.log('inside timeout')
                      if(dataset){
                        params.total(dataset.users.length);
                        //params.settings({ counts: data.length > 10 ? [10, 25, 50] : []});
                        $defer.resolve(dataset.users);
                      }
                  }, 500);
              }
          });
      }).
        error(function(data, status) {
          $scope.errorMessage = data.message;
      });
  };*/


}]);



angular.module('pantallasAdministradorApp')
.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});
