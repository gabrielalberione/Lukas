// Invoca el modo JavaScript 'script'
'use strict';

app.factory('mesasFactory', [
			"$http","$q","md5","CONFIG","store",
	function($http,  $q,  md5,  CONFIG,  store){
		return {
			listar: function(listarOptions){
				var defered = $q.defer();
				var promise = defered.promise;
				
				var url = CONFIG.APIURL+'/mesas.json';
				
				$http({
					method: 'GET',
					url: url,
					params: listarOptions,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				})
				.then(function successCallback(response) {
					/* si viene el token lo actualiza, porque puede ser que un WS no utilice token por ser publico */
					if (typeof response.data.token != 'undefined') {
						store.set('token', response.data.token);
					}
					defered.resolve(response);
				}, function errorCallback(response) {
					defered.reject(response);
				});
			 
				return promise;
			}
		};
	}
]);
