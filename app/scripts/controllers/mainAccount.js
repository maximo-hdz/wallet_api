'use strict';

angular.module('pantallasAdministradorApp')
  .controller('MainAccountCtrl', ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
    if($rootScope.isAuthenticated == null || $rootScope.isAuthenticated == false){
        $location.path('/login');
    }else{
        $http({
            url: '/api/spa/users',
            method: 'GET',
        }).
          success(function(data, status, headers) {
            console.log('Usuarios: '+data.additionalInfo.length);
            $scope.users = data.additionalInfo;
        }).
          error(function(data, status) {
            $scope.errorMessage = data.message;
            $scope.status = status;
            $scope.buttonStatus("Entrar", false);
        });
    }

    $scope.logOut = function(){
        $rootScope.isAuthenticated = false;
        $location.path('/login');
	 };

     $scope.detail = function(user){
        $location.path('/detail/'+user.phoneID);
     }

}]);
