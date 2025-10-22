function cambiarImagen() {
    var imagen = document.getElementById('imagen');
    if (imagen.src.match("https://cdn-icons-png.flaticon.com/512/5280/5280304.png")) {
      imagen.src = "https://cdn.pixabay.com/photo/2021/12/19/11/03/money-6880650_1280.png"; // Cambia a la segunda imagen
    } else {
      imagen.src = "https://cdn-icons-png.flaticon.com/512/5280/5280304.png"; // Cambia a la primera imagen si ya está la segunda
    }
  }
  
  
  function cambiarImagenA() {
    var imagenA = document.getElementById('imagenA');
    if (imagenA.src.match("img/ACERCADE.gif")) {
      imagenA.src = "img/ACERCADE2.gif"; // Cambia a la segunda imagen
    } else {
      imagenA.src = "img/ACERCADE.gif"; // Cambia a la primera imagen si ya está la segunda
    }
  }
  
  function cambiarImagenV() {
    var imagenV = document.getElementById('imagenV');
    if (imagenV.src.match("img/Vision.gif")) {
      imagenV.src = "img/VisionD.png"; // Cambia a la segunda imagen
    } else {
      imagenV.src = "img/Vision.gif"; // Cambia a la primera imagen si ya está la segunda
    }
  }
  
  function cambiarImagenM() {
    var imagenM = document.getElementById('imagenM');
    if (imagenM.src.match("img/Mision.gif")) {
      imagenM.src = "img/MisionD.png"; // Cambia a la segunda imagen
    } else {
      imagenM.src = "img/Mision.gif"; // Cambia a la primera imagen si ya está la segunda
    }
  }
  