'use strict';

/**
 * @ngdoc function
 * @name APP.controller:MainController
 * @description
 * # MainController
 * Controller of the APP
 */
app.controller('CamaraController',  [
			'$rootScope', '$scope', 'store', '$http', '$uibModal', 'ngProgressFactory', '$location', 'CONFIG', 'toaster', 
	function($rootScope,  $scope, store, $http, $uibModal, ngProgressFactory,  $location,  CONFIG, toaster){		
		$scope.sacarFoto = function(){
			if($rootScope.usuarioLogueado){
				navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, 
					correctOrientation: true  });
			}else{
				$scope.openLoginFace();
			}
		}
		
		function onSuccess(imageURI) {
			//$scope.openUpload();
			//$scope.tempimagefilepath = imageURI;
			store.set('imageURI', imageURI);
			$location.path("/upload");			
			//window.open("views/multimedias/upload.html","_self");
		}

		function onFail(message) {
			//alert('Failed because: ' + message);		
		}
		
		$scope.cerrarModal = function () {
			$scope.modalInstance.close();
		};	
		
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