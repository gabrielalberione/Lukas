'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('MainController',  [
			'$rootScope', '$scope', 'store', '$http', '$uibModal', 'databaseFactory', 'mesasFactory', 'ngProgressFactory', '$location', 'CONFIG', 'toaster', 'usuariosFactory', 'UsuariosService', 'eventosFactory', 'EventosService', 'markersFactory', 'multimediasFactory', 'autenticacionFactory', 
	function($rootScope,  $scope, store, $http, $uibModal, databaseFactory, mesasFactory, ngProgressFactory,  $location,  CONFIG, toaster, usuariosFactory, UsuariosService, eventosFactory, EventosService, markersFactory, multimediasFactory, autenticacionFactory){		
		$rootScope.urlFile = CONFIG.URLFILE;
		parent.pageActual = 'main';		
		
		$scope.evento = EventosService.get();	

		if($rootScope.usuarioLogueado){
			$scope.usuario = UsuariosService.get();
		}		
		
		$scope.multimedias = [];			
		$scope.banMarkesLoading = true;
		$scope.banCarruselLoading = true;
		$scope.banCargando = false;

		// obtiene las multimedias para el carrusell
		$scope.getMultimedias = function(){			
			var param = {		
				filter: ["evento_id="+ $scope.evento.id,"multimediascategoria_id=1"]
			};		
			multimediasFactory.listar(param).then(function(res){
				$scope.banCarruselLoading = false;
				$scope.multimedias = res.data.multimedias;
			});
		};
		
		$scope.getMultimedias();
		
		$scope.markers = [];
		
		$scope.getPois = function(){
			var param = {		
				filter: ["evento_id="+ $scope.evento.id]
			};		
			markersFactory.listar(param).then(function(res){		
				$scope.markers = res.data.markers;
				$scope.banMarkesLoading = false;
			});
		};
		
		$scope.getPois();	

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
														setTimeout(function (){
															location.reload(true);
														 }, 5000);
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
		
		$scope.abrirLoginUsuario = function(){
			var modalInstanceLoginUsuario = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: './views/login_usuario.html',
				//controller: 'ModalContactoController',
				scope: $scope,
				size: 'large'
			});		
			/*var auxUser = {};
			auxUser.facebook_id = '10152513265123922';
			auxUser.id = 0;		
			usuariosFactory.guardar(auxUser).then(
				function(res){
					autenticacionFactory.login_usuario('10152513265123922').then(
						function(res) {
							if (typeof res.data.token != 'undefined') {
								/* si existe error lo muestra 
								if (res.data.error != null){
									/* usuario/password incorrecto 
									toaster.pop({
										type: res.data.error.tipo,
										body: res.data.error.mensaje,
										showCloseButton: true
									});
									alert("Error!");
								} else{
									window.location.reload();
								}
							} else{
								alert("Error!");
							}					
						}
					);
				}, function(){
					alert("Problemas para conectar con el servidor!");
				}
			);	*/	
		}
		
		$scope.loginGoogle = function() {
			callGoogle();
		}
			
		$scope.logoutEvento = function(){
			$rootScope.eventoLogueado = false;
			$rootScope.usuarioLogueado = false;			
			autenticacionFactory.logout();
			window.location.reload();
		};	
				
		$scope.punto = {};
		$scope.map = {};
		
		$scope.cerrarModal = function () {
			$scope.modalInstance.close();
		};	
		
		$scope.modalInstance = {};
		
		$scope.abrirMapa = function(pLatitude, pLongitude, pEtiqueta, pId){
			parent.pagePadreModal = parent.pageActual;
			parent.pageActual = 'modal';							

			$scope.punto = {};
			$scope.map = {};
		
			$scope.punto = {
				id: pId,
				coords: {
					latitude: pLatitude,
					longitude: pLongitude
				},
				options: { draggable: false, labelContent: pEtiqueta, labelClass:"markerlabel" }
			};
		
			$scope.map = {
				center: {
					latitude: pLatitude,
					longitude: pLongitude
				},
				zoom: 13,
				options: {
					scrollwheel: false,
					mapTypeControl: false,
					streetViewControl: false,
					zoomControl: false
				}
			};	
			
			$scope.render = true;	
			
		    $scope.modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: './views/mapa.html',
				scope: $scope,
				size: 'large'
			});	

		}
		
		$scope.sacarFoto = function(){
			navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, 
				correctOrientation: true  });
		}
		
		function onSuccess(imageURI) {
			$scope.openUpload();
			$scope.tempimagefilepath = imageURI;
		}

		function onFail(message) {
			alert('Failed because: ' + message);		
		}
		
		$scope.test = function () {
			var modalInstanceUpload = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: './views/multimedias/upload.html',
				//controller: 'ModalContactoController',
				scope: $scope,
				size: 'large'
			});
		}
		
		$scope.openUpload = function (pMultimediaId) {
			parent.pagePadreModal = parent.pageActual;
			parent.pageActual = 'modal';
		    $scope.modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: './views/multimedias/upload.html',
				//controller: 'ModalContactoController',
				scope: $scope,
				size: 'large'
			});			
			
			$scope.ultimaFoto = {};
			
			$scope.enviarMultimedia = function (pComentario){
				$scope.banCargando = true;
				var options = new FileUploadOptions();
				options.fileKey="file";
				options.fileName=$scope.tempimagefilepath.substr($scope.tempimagefilepath.lastIndexOf('/')+1);
				options.mimeType="image/jpeg";
				options.chunkedMode = false;
				
				var params = {};
				params.token = autenticacionFactory.getToken();
				params.multimediascategoria_id = 2;
				params.multimediastipo_id = 1;
				params.comentario = pComentario;				
				params.evento_id = $scope.evento.id;
				options.params = params;
				
				// Genero el objeto foto para insertar en BD
				$scope.ultimaFoto.id = 0;
				$scope.ultimaFoto.comentario = pComentario;
				$scope.ultimaFoto.evento_id = $scope.evento.id;
				$scope.ultimaFoto.ruta = $scope.tempimagefilepath;
				$scope.ultimaFoto.rotacion = "0";
				$scope.ultimaFoto.estado = 0;
								
				var ft = new FileTransfer();
				ft.upload($scope.tempimagefilepath, encodeURI(CONFIG.APIURL + "/subirarchivo/upload_imagen"), uploadSuccess, uploadFail, options);						
			};	
			
			function uploadSuccess(r){
				//console.log("Response = " + r.response);
				alert("ok!");
				$scope.cerrarModal();				
				/*toaster.pop({
					type: r.response.mensaje.tipo,
					body: r.response.mensaje.texto,
					showCloseButton: true
				});		*/	
				$scope.ultimaFoto.estado = 0;
				databaseFactory.guardarFoto($scope.ultimaFoto);
			}
			
			function uploadFail(){
				alert("false!");
				$scope.cerrarModal();
				$scope.ultimaFoto.estado = 1;
				databaseFactory.guardarFoto($scope.ultimaFoto);	
				console.log("Fallo el upload de foto");	
				toaster.pop({
					type: 'error',
					body: 'No pudo subirse la foto, la app intenará enviarla luego, para ver su estado ingresa a "Tus Fotos"',
					showCloseButton: true
				});					
			}

		};	
		
	}
]);