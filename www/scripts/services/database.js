// Invoca el modo JavaScript 'script'
'use strict';

app.factory('databaseFactory', [
			"$http", '$rootScope', "$q","md5","CONFIG","store",
	function($http, $rootScope, $q,  md5,  CONFIG,  store){
		return {
			openDatabase: function(){
				$rootScope.db = null;
				try{
				   $rootScope.db = openDatabase('db_lukas', '1.0', 'Lukas', 200000);
				   console.log('database aceptada.');
				   $rootScope.banDB = true;
				}catch(e){
				   console.log('La aplicacion no soporta html5 database.');
				   navigator.app.exitApp();
				}
			},
			crearTablas: function(){
				if($rootScope.banDB){
					$rootScope.db.transaction(function(tx){
					   tx.executeSql("CREATE TABLE IF NOT EXISTS fotos(id integer primary key autoincrement, ruta text, estado integer, rotacion text, evento_id integer, comentario text)");
					   tx.executeSql("CREATE TABLE IF NOT EXISTS mesas(id integer primary key autoincrement, nombre text, mesanro integer, cantidad text, evento_id integer)");
					});
				}
			},
			guardarFoto: function(pFoto){
				return $q(function(resolve, reject) {
					$rootScope.db.transaction(function(tx){
						if(pFoto.id == 0){
						   tx.executeSql("INSERT INTO fotos(ruta, estado, rotacion, evento_id, comentario) VALUES(?,?,?,?,?)", [pFoto.ruta, pFoto.estado, pFoto.rotacion, pFoto.evento_id, pFoto.comentario], function(tx, respuesta){
								resolve("todo ok");
						   }, function(tx, respuesta){
								reject("fallo consulta");
						   });
						}else{
							$rootScope.db.transaction(function(tx){
								tx.executeSql('UPDATE fotos SET estado = ? WHERE id = ?', [pFoto.estado, pFoto.id], function(){
									resolve("todo ok");
								}, function(){
									reject("fallo consulta");
								});
							});
						}
					});
				});
			},	
			eliminarFoto: function(pId){
				$rootScope.db.transaction(function(tx){
					tx.executeSql('DELETE FROM fotos WHERE id = ?', [pId], function(){
					   console.log("Foto borrada correctamente!");
					}, function(){
					   console.log("Error al borrar la foto!");
					});
				});
			},	
			getFotos: function(){
				var misFotos = {};
				return $q(function(resolve, reject) {
					$rootScope.db.transaction(function(tx){
						tx.executeSql('SELECT id, ruta, estado, comentario, evento_id, rotacion FROM fotos WHERE estado = 1', [], function(tx, respuesta){
						   for(var i = 0; i < respuesta.rows.length; i++){
							  misFotos[i] = {
								 id: respuesta.rows.item(i).id,
								 ruta: respuesta.rows.item(i).ruta,
								 estado: respuesta.rows.item(i).estado,
								 comentario: respuesta.rows.item(i).comentario,
								 evento_id: respuesta.rows.item(i).evento_id,
								 rotacion: respuesta.rows.item(i).rotacion
							  };
						   }	
						}, function(){
						  reject("fallo consulta");
						});
										
						resolve(misFotos);
					});
				});
			},	
			getFotoRechazada: function(){
				var misFotos = {};
				return $q(function(resolve, reject) {
					$rootScope.db.transaction(function(tx){
						tx.executeSql('SELECT id, ruta, estado, comentario, evento_id, rotacion FROM fotos WHERE estado = 1', [], function(tx, respuesta){
						   for(var i = 0; i < respuesta.rows.length; i++){
							  misFotos[i] = {								
								 id: respuesta.rows.item(i).id,
								 ruta: respuesta.rows.item(i).ruta,
								 estado: respuesta.rows.item(i).estado,
								 comentario: respuesta.rows.item(i).comentario,
								 evento_id: respuesta.rows.item(i).evento_id,
								 rotacion: respuesta.rows.item(i).rotacion
							  };
						   }	
						}, function(){
						  reject("fallo consulta");
						});
										
						resolve(misFotos);
					});
				});
			}			
		};
	}
]);
