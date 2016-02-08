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
		
		$scope.mensaje = '';
		$scope.mensajeTipo = 'info';
		$scope.login = function(evento){
			$scope.banCargando = true;
			$scope.mensaje = '';
			autenticacionFactory.login_evento(evento).then(
			function(res) {
					if (typeof res.data.token != 'undefined') {
						/* si existe error lo muestra */
						if (res.data.error != null){
							/* usuario/password incorrecto */
							toaster.pop({
								type: res.data.error.tipo,
								body: res.data.error.mensaje,
								showCloseButton: true
							});
						} else{
							$rootScope.eventoLogueado = true;
							EventosService.set(autenticacionFactory.getEvento());	
							$location.path("/main");
						}
					} else{
						toaster.pop({
							type: 'error',
							body: 'Error: intente nuevamente.',
							showCloseButton: true
						});
					}					
				}
			);
		}		
	}
])