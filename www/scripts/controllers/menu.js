'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('MenuController',  [
			'$scope', '$route', '$rootScope','autenticacionFactory', 'store', '$interval', 'eventosFactory', '$location',
	function($scope,  $route, $rootScope, autenticacionFactory,  store,  $interval, eventosFactory, $location){

		$rootScope.evento = autenticacionFactory.getEvento();		
		
		$scope.logoutEvento = function(){
			autenticacionFactory.logout();
			window.location.reload();
			//$location.path("#/login");
		};
	}
]);