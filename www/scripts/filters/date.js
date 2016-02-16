app
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});

app
.filter("asDateRelativa", function () {
    return function (date) {
		var seconds = Math.floor((new Date() - date) / 1000);

		var interval = Math.floor(seconds / 31536000);

		if (interval > 1) {
			return interval + " años";
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return interval + " mesas";
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return interval + " días";
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return interval + " horas";
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return interval + " minutos";
		}
		
		return Math.floor(seconds) + " segundos";	
	}
});
