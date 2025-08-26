// muestra si el IP tiene proyectos abiertos
apex.message.clearErrors();
	
	// Esperamos brevemente a que el combo termine de cargarse
	setTimeout(function() {
		const opciones = $("#P9_REF_PROY option");
		const seleccionado = $v("P9_REF_PROY");
		
		// Si solo hay una opcion la nula o ninguna
		if (opciones.length <= 1 || !opciones[1]?.value) {
			apex.message.alert("AVISO: El investigador seleccionado no tiene proyectos abiertos.");
		}
	}, 300)

// muestra duración del proyecto.
apex.message.clearErrors();
	
	var duracion = $v("P9_DURACION");
	if (duracion && duracion.trim() !== "") {
		apex.message.alert("AVISO: La duracion del proyecto es: " + duracion);
	}
