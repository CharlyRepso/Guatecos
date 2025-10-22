$.ajax({
  url: '/bk_mision', // Cambia la URL según tu configuración
  method: 'POST',
  success: function(data) {

    data.forEach(function callback(currentValue, index, array) {
        const base64Image = currentValue.imagen;
        const img = new Image();
        // Establece la fuente del elemento Image como la cadena base64
        img.src = base64Image;
        // Espera a que la imagen se cargue
        img.onload = function() {
          $("#prueba").append(img);
        };
    });
  },
  error: function(error) {
  }
});