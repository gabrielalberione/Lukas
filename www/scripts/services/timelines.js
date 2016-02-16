// Invoca el modo JavaScript 'script'
'use strict';

app.service('TimelineService', function () {
	var timelines = {};

	return {
		get: function () {
			return timelines;
		},
		set: function(f) {
			timelines = f;
		}
	};
});


app.factory('timelinesFactory', [
			"$http","$q","md5","CONFIG","store", '$rootScope',
	function($http,  $q,  md5,  CONFIG,  store, $rootScope){
		return {
			listar: function(listarOptions){
				var defered = $q.defer();
				var promise = defered.promise;
				if($rootScope.banConexion){	
					var url = CONFIG.APIURL+'/timelines.json';
					
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
						
						defered.resolve(response.data.multimedias);
					}, function errorCallback(response) {
						defered.reject(response);
					});
				}else{
					defered.resolve(store.get('timeline'));
				}
			 
				return promise;
			}
		};
	}
]);
