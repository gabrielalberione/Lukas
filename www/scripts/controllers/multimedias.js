'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('MultimediasController',  [
			'$scope', 'store', '$http', '$uibModal', 'databaseFactory', 'EventosService', 'ngProgressFactory', '$location', 'CONFIG', 'toaster', 'usuariosFactory', 'multimediasFactory', 'autenticacionFactory', 
	function($scope, store, $http, $uibModal, databaseFactory, EventosService, ngProgressFactory,  $location,  CONFIG, toaster, usuariosFactory, multimediasFactory, autenticacionFactory){			
		$scope.misFotos = {};
		$scope.evento = EventosService.get();
		parent.pageActual = 'multimedias';	
		
		$scope.listarFotos = function(){
			var promise = databaseFactory.getFotos();		
			promise.then(function(greeting) {
			  $scope.misFotos = greeting;
			}, function(reason) {
			  alert(reason);
			});
		}
		
		$scope.listarFotos();
		
		$scope.borrarFoto = function(pId){
			databaseFactory.eliminarFoto(pId);	
			databaseFactory.getFotos();	
		};		
				
		$scope.ultimaFoto = {};		
				
		$scope.reSubir = function(pFoto){
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=pFoto.ruta.substr(pFoto.ruta.lastIndexOf('/')+1);
			options.mimeType="image/jpeg";
			
			var params = {};
			params.token = autenticacionFactory.getToken();
			params.multimediascategoria_id = 2;
			params.multimediastipo_id = 1;
			params.comentario = pFoto.comentario;				
			params.evento_id = $scope.evento.id;
			options.params = params;

			$scope.ultimaFoto.comentario = pFoto.comentario;
			$scope.ultimaFoto.id = pFoto.id;
			$scope.ultimaFoto.evento_id = $scope.evento.id;
			$scope.ultimaFoto.ruta = pFoto.ruta;
			$scope.ultimaFoto.rotacion = "0";
			$scope.ultimaFoto.estado = 0;
							
			var ft = new FileTransfer();
			ft.upload(pFoto.ruta, encodeURI(CONFIG.APIURL + "/subirarchivo/upload_imagen"), $scope.uploadSuccess, $scope.uploadFail, options);						
		}	

		$scope.uploadSuccess = function(r){
			console.log("id = " + $scope.ultimaFoto.id);	
			$scope.ultimaFoto.estado = 0;
			var promise = databaseFactory.guardarFoto($scope.ultimaFoto);		
			promise.then(function(greeting) {
				$scope.listarFotos();
			}, function(reason) {
			  alert(reason);
			});			
			
		}
		
		$scope.uploadFail = function(){
			toaster.pop({
				type: 'error',
				body: 'No pudo subirse la foto, la app intenará enviarla luego, para ver su estado ingresa a "Tus Fotos"',
				showCloseButton: true
			});				
		}			
		
	}
]);