// Invoca el modo JavaScript 'script'
'use strict';

app.factory("autenticacionFactory", [
			"$http","$q","$location","md5","CONFIG","store","jwtHelper",
	function($http,  $q,  $location,  md5,  CONFIG,  store,  jwtHelper){
		var defer = $q.defer();

		this.observarSession = function() {
			return defer.promise;
		};

		this.setToken = function(token) {
			// se guarda en el store el token para que si apreta F5 siga estando logueado, salvo caducidad.
			store.set('token', token)
			defer.notify(store.get('token'));
		};
		
		this.getToken = function() {
			return store.get('token');
		};
		
		/* realiza el login, comunicando con el servidor y guarda el token devuelto */
		this.login_evento = function(evento){
			var defered = $q.defer();
			var promise = defered.promise;
			$http({
				method: 'POST',
				skipAuthorization: true, //no queremos enviar el token en esta petición
				url: CONFIG.APIURL+'/autenticacion/login.js',
				data: {eventoclave: evento.clave},
				headers: {'Content-Type': 'application/json'}
			})
			.then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				
				/* guarda el token */
				store.set('token', response.data.token);
				defered.resolve(response);
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				if (status === 400) {
					defered.resolve("error");
				} else {
					defered.resolve("error");
					//throw new Error("Fallo obtener los datos:" + response.status);
				}
			});
		 
			return promise;
		};
		
		/* realiza el login, comunicando con el servidor y guarda el token devuelto */
		this.login_usuario = function(pFaceId){
			var defered = $q.defer();
			var promise = defered.promise;
			$http({
				method: 'POST',
				skipAuthorization: false, 
				url: CONFIG.APIURL+'/autenticacion/login_redes_mobile.js',
				data: {facebook_id: pFaceId},
				headers: {'Content-Type': 'application/json'}
			})
			.then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				
				/* guarda el token */
				store.set('token', response.data.token);
				defered.resolve(response);
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				if (status === 400) {
					defered.reject(response);
				} else {
					throw new Error("Fallo obtener los datos:" + response.status);
				}
			});
		 
			return promise;
		};		
		
		/* verifica si esta logueado */
		this.verificar = function() {
			var token = store.get('token');
			if ((token == null) || (jwtHelper.isTokenExpired(token))){
				return false
			}
			return true;
		};
		
		/* pone en null el token para desloguear */
		this.logout = function() {
			this.setToken(null);
			return true;
		};
		
		/* devuelve los datos del evento logueado */
		this.getEvento = function(){
			if (this.verificar()){
				var token = store.get('token');
				//decodificamos para obtener los datos del user
				var tokenPayload = [];
				tokenPayload = jwtHelper.decodeToken(token);
				//retornamos el usuario
				return tokenPayload.Evento;
			} else{
				$location.path("/login");
				return null;
			}
		}
		
		/* devuelve los datos del usuario logueado */
		this.getUsuario = function(){
			if (this.verificar()){
				var token = store.get('token');
				//decodificamos para obtener los datos del user
				var tokenPayload = [];
				tokenPayload = jwtHelper.decodeToken(token);
				//retornamos el usuario
				return tokenPayload.Usuario;
			} else{
				$location.path("/login");
				return null;
			}
		}		
		
		return this;
	}
])