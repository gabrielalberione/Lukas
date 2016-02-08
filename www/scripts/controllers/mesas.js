'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('MesasController',  [
			'$scope', 'store', '$http', '$location', 'CONFIG', 'ngProgressFactory', 'mesasFactory', 'EventosService', 'autenticacionFactory', 
	function($scope, store, $http,  $location,  CONFIG, ngProgressFactory, mesasFactory, EventosService, autenticacionFactory){
			
		$scope.evento = EventosService.get();
		parent.pageActual = 'mesas';		
		var param = {
			filter: "evento_id="+$scope.evento.id
		};
		
		$scope.mesas = [];

		$scope.progressbar = ngProgressFactory.createInstance();		
		$scope.progressbar.setParent(document.getElementById('barra_inferior'));
		$scope.progressbar.setAbsolute();					
		$scope.progressbar.start();
		$scope.progressbar.set(15);				
		
		mesasFactory.listar(param).then(function(res){
			$scope.progressbar.complete();
			$scope.mesas = res.data.mesas;
		});
		
		$scope.filtrarMesas = function(){
			if($scope.filtro.mesa != ''){
				param = {
					filter: ["evento_id="+$scope.evento.id+"##mesanro="+$scope.filtro.mesa]
				};				
			}else{				
				param = {
					filter: ["evento_id="+$scope.evento.id]
				};				
			}
			mesasFactory.listar(param).then(function(res){
			$scope.mesas = res.data.mesas;
		});
		};
		
		$scope.filtrarInvitado = function(){
			param = {
				filter: ["evento_id="+$scope.evento.id+"##Mesa.nombre LIKE "+$scope.filtro.invitado]
			};
			mesasFactory.listar(param).then(function(res){
			$scope.mesas = res.data.mesas;
		});
		};		
		
	}
]);
