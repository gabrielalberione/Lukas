app.controller('loginController', [
			'$rootScope', '$scope', 'store','CONFIG','autenticacionFactory', 'toaster','$location', 'EventosService', 
	function($rootScope, $scope, store, CONFIG,  autenticacionFactory, toaster,  $location, EventosService){
		parent.pageActual = 'login';
		
		$scope.evento = {
			clave: 'test'
		};
		
		// siempre que entre al login desloguea
		autenticacionFactory.logout();
		
		$scope.banCargando = false;
		
		$scope.login = function(evento){
			$scope.banCargando = true;
			autenticacionFactory.login_evento(evento).then(
			function(res) {
					if (res != "error") {						
						/* si existe error lo muestra */
						if (res.data.token == null){
							/* usuario/password incorrecto */
							toaster.pop({
								type: 'error',
								body: 'La contraseña no corresponde a ningún evento!',
								showCloseButton: true
							});
							$scope.banCargando = false;
						} else{
							$rootScope.eventoLogueado = true;
							EventosService.set(autenticacionFactory.getEvento());	
							$location.path("/main");
						}
					} else{
						toaster.pop({
							type: 'error',
							body: 'No se puede conectar al servicor, verifique su conexión a internet!',
							showCloseButton: true
						});
						$scope.banCargando = false;
					}					
				}
			);
		}		
	}
])