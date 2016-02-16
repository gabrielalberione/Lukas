'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('TimelinesController',  [
			'$rootScope', '$scope', 'store', '$http', '$uibModal', 'TimelineService', 'databaseFactory', 'usuariosFactory', '$location', 'CONFIG', 'toaster', 'UsuariosService', 'EventosService', 'ngProgressFactory', 'likesFactory', 'comentariosFactory', 'timelinesFactory', 'autenticacionFactory', 
	function($rootScope,  $scope, store, $http,  $uibModal, TimelineService, databaseFactory, usuariosFactory, $location,  CONFIG, toaster, UsuariosService, EventosService, ngProgressFactory, likesFactory, comentariosFactory, timelinesFactory, autenticacionFactory){					
		$scope.multimedias = [];
		parent.pageActual = 'timeline';		
		var listarOptions = {};
		listarOptions.sort = 'Multimedia.id';
		listarOptions.pageNumber = 0;
		listarOptions.pageSize = 5;
		$scope.usuario = {};
		
		if($rootScope.usuarioLogueado){
			$scope.usuario = UsuariosService.get();
		}
		
		$scope.evento = EventosService.get();
		
		$scope.banCargando = false;		
		
		$scope.cerrarModal = function () {
			$scope.modalInstance.close();
		};	
		
		$scope.modalInstance = {};
		
		$scope.getMultimedias = function(){						
			listarOptions.filter = ["evento_id="+ $scope.evento.id+"##multimediascategoria_id=2"];
			listarOptions.sort = "Multimedia.id DESC";
			if($rootScope.usuarioLogueado){
				listarOptions.usuario_id = $scope.usuario.id;
			}
			timelinesFactory.listar(listarOptions).then(function(res){
				$scope.banCargando = false;
				$scope.multimedias = $scope.multimedias.concat(res);
				store.set('timeline',$scope.multimedias);
			});
		};				
		
		$scope.listarMasFotos = function(){
			/* infinite scroll */
			listarOptions.pageNumber ++;
			$scope.banCargando = true;	
			$scope.getMultimedias();			
		};	
		
		$scope.listarMasFotos();
		
		$scope.open = function (pMultimediaId) {
			parent.pagePadreModal = parent.pageActual;
			parent.pageActual = 'modal';
		    $scope.modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: './views/timelines/zoom.html',
				//controller: 'ModalContactoController',
				scope: $scope,
				size: 'large'
			});
			
			var param = {		
				filter: ["Multimedia.id="+ pMultimediaId]
			};		
			
			timelinesFactory.listar(param).then(function(res){
				$scope.multimediaActiva = res.data.multimedias[0];
			});	

			var paramComentarios = {		
				filter: ["multimedia_id="+ pMultimediaId]
			};		
					
			comentariosFactory.listar(paramComentarios).then(function(res){
				$scope.multimediaActivaComentarios = res.data.comentarios;
			});				
										
			$scope.enviarComentario = function (pComentario){
				auxComentario.multimedia_id = $scope.multimediaActiva.Multimedia.id;
				auxComentario.id = 0;
				auxComentario.usuario_id = $scope.usuario.id;
				auxComentario.evento_id = $scope.evento.id;
				auxComentario.comentario = pComentario;
				comentariosFactory.guardar(auxComentario).then(
					function(res){
						comentariosFactory.listar(paramComentarios).then(function(res){
							$scope.multimediaActivaComentarios = res.data.comentarios;
						});						
					}, function(){
						toaster.pop({
							type: "error",
							body: "No se pudo enviar el comentario, verifique su conexión a internet!",
							showCloseButton: true
						});
					}
				);						
			};			

		};
		
		var auxLike = {};
		
		$scope.darLike = function (pMultimediaId, pIndex){
			if($rootScope.usuarioLogueado){			
				auxLike.multimedia_id = pMultimediaId;
				auxLike.id = 0;
				auxLike.usuario_id = $scope.usuario.id
				auxLike.evento_id = $scope.evento.id;
				likesFactory.guardar(auxLike).then(
					function(res){
						//$scope.getMultimedias();	
						if($scope.multimedias[pIndex].Multimedia.usuario_like == 0){
							$scope.multimedias[pIndex].Multimedia.usuario_like = 1;
							$scope.multimedias[pIndex].Multimedia.c_likes++;
						}else{
							$scope.multimedias[pIndex].Multimedia.usuario_like = 0;
							$scope.multimedias[pIndex].Multimedia.c_likes--;
						}						
					}, function(){
						toaster.pop({
							type: "error",
							body: "No se pudo dar el like, verifique su conexión a internet!",
							showCloseButton: true
						});
					}
				);						
			}else{
				$scope.openLoginFace();
			}
		};
		
		var auxComentario = {};				
		
		$scope.loginFace = function(){
			if($rootScope.usuarioLogueado){
				$scope.logoutEvento();
			}else{
				var face_id = 0;
				var fbLoginSuccess = function (userData) {	
					//alert(JSON.stringify(userData));									
					$.each(userData.authResponse, function(key, val) {
						if(key == "userID"){
							facebookConnectPlugin.api(val+"/?fields=id,email,first_name,last_name", ["public_profile"],
							function (result) {
								//alert(JSON.stringify(result));		
								var face_id = result.id;	
								var nombre = result.first_name;
								var apellido = result.last_name;
								var email = result.email;
								var auxUser = {};
								auxUser.facebook_id = face_id;
								auxUser.nombres = nombre;
								auxUser.apellido = apellido;
								auxUser.email = email;
								auxUser.id = 0;
								usuariosFactory.guardar(auxUser).then(
									function(res){
										autenticacionFactory.login_usuario(face_id).then(
											function(res) {
												if (typeof res.data.token != 'undefined') {
													/* si existe error lo muestra */
													if (res.data.error != null){
														/* usuario/password incorrecto 
														toaster.pop({
															type: res.data.error.tipo,
															body: res.data.error.mensaje,
															showCloseButton: true
														});*/
														alert("Error!");
													} else{
														$location.path("/");	
														setTimeout(function (){
															location.reload(true);
														 }, 200);
													}
												} else{
													alert("Error!");
												}					
											}
										);
									}, function(res){
										alert("Problemas para conectar con el servidor: "+res);
									}
								);													
							},
							function (error) {
								alert("Failed: " + error);
							});								 
						}
					})
				};
			
				facebookConnectPlugin.login(["public_profile", "email"],
					fbLoginSuccess,
					function (error) { alert("" + error) }
				);	
			}				
		}
		
		$scope.openLoginFace = function (pMultimediaId) {
			parent.pagePadreModal = parent.pageActual;
			parent.pageActual = 'modal';
		    $scope.modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: './views/alertas/facebook.html',
				//controller: 'ModalContactoController',
				scope: $scope,
				size: 'large'
			});			
			
			$scope.ultimaFoto = {};
			
			$scope.ingresarFace = function (pComentario){
				$scope.loginFace();
				$scope.modalInstance.close();
			};	
			
		};
		
	}
]);
