'use strict';

angular.module('pantallasAdministradorApp')
  .controller('detailCtrl', ['$scope', '$rootScope', '$location', '$http', '$routeParams', '$filter', 'ngTableParams', function ($scope, $rootScope, $location, $http, $routeParams, $filter, ngTableParams) {
    //if(false){
    if($rootScope.isAuthenticated == null || $rootScope.isAuthenticated == false){
        $location.path('/login');
    }else{

        $http({
            url: '/api/spa/loans/'+$routeParams.phoneId,
            method: 'GET',
        }).
          success(function(data, status, headers) {

            $scope.loans = data.additionalInfo;

            $scope.tableParamsloans = new ngTableParams({
                page: 1,
                count: 10,
                sorting: {
                    date: 'asc'
                },
            }, {
                total: $scope.loans.length,
                getData: function($defer, params) {
                    $scope.loans = params.sorting() ?
                                        $filter('orderBy')($scope.loans, params.orderBy()) :
                                        $scope.loans;
                    var orderedData = $scope.loans;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        }).
          error(function(data, status) {
            $scope.errorMessage = data.message;
        });

        $http({
            url: '/api/spa/receipts/'+$routeParams.phoneId,
            method: 'GET',
        }).
          success(function(data, status, headers) {
            $scope.receipts = data.additionalInfo;

            $scope.tableParamsreceipts = new ngTableParams({
                page: 1,
                count: 10,
                sorting: {
                    date: 'asc'
                }
            }, {
                total: $scope.receipts.length,
                getData: function($defer, params) {
                    $scope.receipts = params.sorting() ?
                                        $filter('orderBy')($scope.receipts, params.orderBy()) :
                                        $scope.receipts;
                    var orderedData = $scope.receipts;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        }).
          error(function(data, status) {
            $scope.errorMessage = data.message;
        });

        $http({
            url: '/api/spa/transactions/'+$routeParams.phoneId+'/money',
            method: 'GET',
        }).
          success(function(data, status, headers) {
            $scope.moneys = data.additionalInfo;

            $scope.tableParamsmoney = new ngTableParams({
                page: 1,
                count: 10,
                sorting: {
                    date: 'asc'
                }
            }, {
                total: $scope.moneys.length,
                getData: function($defer, params) {
                    $scope.moneys = params.sorting() ?
                                        $filter('orderBy')($scope.moneys, params.orderBy()) :
                                        $scope.moneys;

                    var orderedData = $scope.moneys;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        }).
          error(function(data, status) {
            $scope.errorMessage = data.message;
        });

        $http({
            url: '/api/spa/transactions/'+$routeParams.phoneId+'/dox',
            method: 'GET',
        }).
          success(function(data, status, headers) {
            $scope.doxs = data.additionalInfo;

            $scope.tableParamsdoxs = new ngTableParams({
                page: 1,
                count: 10,
                sorting: {
                    date: 'asc'
                }
            }, {
                total: $scope.doxs.length,
                getData: function($defer, params) {
                    $scope.doxs = params.sorting() ?
                                        $filter('orderBy')($scope.doxs, params.orderBy()) :
                                        $scope.doxs;
                    var orderedData = $scope.doxs;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        }).
          error(function(data, status) {
            $scope.errorMessage = data.message;
        });

    };

    $scope.logOut=function(){
        $rootScope.isAuthenticated = false;
        $location.path('/login');
	 };

    $scope.main = function(){
        $location.path('/main');
    }
}]);
