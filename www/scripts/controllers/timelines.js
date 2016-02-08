'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('TimelinesController',  [
			'$rootScope', '$scope', 'store', '$http', '$uibModal', 'databaseFactory', '$location', 'CONFIG', 'toaster', 'UsuariosService', 'EventosService', 'ngProgressFactory', 'likesFactory', 'comentariosFactory', 'timelinesFactory', 'autenticacionFactory', 
	function($rootScope,  $scope, store, $http,  $uibModal, databaseFactory, $location,  CONFIG, toaster, UsuariosService, EventosService, ngProgressFactory, likesFactory, comentariosFactory, timelinesFactory, autenticacionFactory){					
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
				$scope.multimedias = $scope.multimedias.concat(res.data.multimedias);
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
				toaster.pop({
					type: "info",
					body: "Debe iniciar sesión como usuario para dar likes y comentar!",
					showCloseButton: true
				});
			}
		};
		
		var auxComentario = {};
		
		
	}
]);
