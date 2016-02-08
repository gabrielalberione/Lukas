'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('backgroundController',  [
			'$scope','$rootScope', '$route','CONFIG', "$q",'$location', 'databaseFactory', 'autenticacionFactory', 'EventosService', 'store','$interval',
	function($scope,  $rootScope, $route, CONFIG, $q, $location, databaseFactory, autenticacionFactory, EventosService, store,  $interval){		
		
		$scope.prepararDB = function(){
			// Creo la BD si no existe
			databaseFactory.openDatabase();
			databaseFactory.crearTablas();		
		}
		
		/* verifica si hay fotos para enviar */
		var intervalChequeos = $interval(function() {	
			if($rootScope.eventoLogueado){
				var promiseCon = $scope.verificiarConexion();
				promiseCon.then(function(pReturn) {
					if(pReturn){
						var promise = databaseFactory.getFotoRechazada();		
						promise.then(function(greeting) {
							$scope.reEnviar(greeting[0]);
						}, function(reason) {
						  alert(reason);
						});		
					}
				}, function(reason) {
				  alert(reason);
				});		
			}				
		}, 10000);				
		
		/* verifica si hay conexion */
		$scope.verificiarConexion = function(){
			return $q(function(resolve, reject) {
				if((navigator.network.connection.type).toUpperCase() != "NONE" &&
				   (navigator.network.connection.type).toUpperCase() != "UNKNOWN") {
				   
					if(parent.pageActual == 'offline'){
						$location.path("/");	
					}else if($rootScope.banConexion == false){
						$scope.actualizarPantalla();
					}
					
					$rootScope.banConexion = true;
					resolve(true);		
				}else{
					$rootScope.banConexion = false;
					if(parent.pageActual == 'login'){
						parent.pageActual = 'offline';
						$location.path("/offline");
					}	
					
					resolve(false);		
				}
			});
		}
		
		$scope.ultimaFoto = {};
		
		/* verifica si hay fotos para enviar */
		$scope.reEnviar = function(pFoto){		
			if (typeof pFoto != 'undefined'){
				$scope.evento = EventosService.get();
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
				
				if($scope.evento.id != null){
					var ft = new FileTransfer();
					ft.upload(pFoto.ruta, encodeURI(CONFIG.APIURL + "/subirarchivo/upload_imagen"), $scope.uploadSuccess, $scope.uploadFail, options);						
				}
			}
		}	

		$scope.uploadSuccess = function(r){
			console.log("id = " + $scope.ultimaFoto.id);	
			$scope.ultimaFoto.estado = 0;
			databaseFactory.guardarFoto($scope.ultimaFoto);					
		}
		
		$scope.uploadFail = function(){
			// caca			
		}	

		$scope.actualizarPantalla = function(){
			$route.reload();
		}

	}
]);