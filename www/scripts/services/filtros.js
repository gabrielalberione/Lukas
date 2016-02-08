app.service('filtroService', function () {
	var filtro = {
		zona: -1,
		fechadesde: new Date('2015-08-05'),
		//fechadesde: new Date(),
		fechahasta: new Date(),
		laboratorios: [],
		estados: [],
		estructurasregionales: [],
		supervisores: [],
		representantes: []
	};

	return {
		get: function () {
			return filtro;
		},
		set: function(f) {
			filtro = f;
		}
	};
});