// Funcion que intenta reenviar las fotos que no se pudieron enviar antes
function reenvio_automatico_fotos(){
	console.log("comienza...");
	clearInterval(intervalFotosAuto);
	db.transaction(function(tx) {
		tx.executeSql("SELECT id, ruta, estado, rotacion FROM fotos WHERE estado = 0 LIMIT 1", [], function(tx,results){
		if (results.rows.length > 0) {
				var params = {};
				params.evento_id = $rootScope.evento.id;		
				params.rotacion = results.rows.item(0).rotacion;
				foto_id_upload = results.rows.item(0).id;
				uploadPhoto(results.rows.item(0).ruta, '/lineas/ws_add_foto/', auto_uploadSuccess, auto_dbErrorHandler, params);
			}
		}, dbErrorHandler);
	});		
	ws_reenviar_foto();	
}

function auto_uploadSuccess(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	console.log("Su foto ya esta compartida para el evento!");
	db.transaction(function(tx) {
		tx.executeSql("UPDATE fotos SET estado = 1 WHERE id = "+foto_id_upload);	
	}, dbErrorHandler,dbSuccessCB);
	intervalFotosAuto = setInterval("reenvio_automatico_fotos()", 10000);
}

function auto_dbErrorHandler(r) {
	intervalFotosAuto = setInterval("reenvio_automatico_fotos()", 10000);
}

function ws_reenviar_foto(foto_id){
	db.transaction(function(tx) {
		tx.executeSql("SELECT id, ruta, estado, rotacion FROM fotos WHERE id = "+foto_id, [], function(tx,results){
		if (results.rows.length > 0) {
				var params = {};
				params.evento_id = $rootScope.evento.id;		
				params.rotacion = results.rows.item(0).rotacion;
				var splashLoading = document.getElementById('splashLoading');
				splashLoading.style.display = 'block';
				foto_id_upload = foto_id;
				uploadPhoto(results.rows.item(0).ruta, '/multimedias/add_file/', auto_uploadSuccess, auto_dbErrorHandler, params);
			}
		}, dbErrorHandler);
	});		
}

function uploadPhoto(imageURI,url_action, uploadSuccess, uploadFail, params) {
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";

	options.params = params;

	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(CONFIG.APIURL+url_action), uploadSuccess, uploadFail, options);
}
