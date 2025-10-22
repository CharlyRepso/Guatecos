$(document).ready(function() {
  setMenu();
  getPage(obtenerParametro('p'));


  $(".nav_link").click(function() {
    var page = $(this).attr("page");
    enviarParametro(page); 
  });
  
  $("#btn_log_out").click(function () {
    $.ajax({
      url: '/sessionManager', // Cambia la URL según tu configuración
      method: 'POST',
      async: true,
      data: {op:2},
      success: function(data) {
          if (data == 'true') {
              window.location.href = 'index.html';
          }
      },
      error: function(error) {
          console.error('Error en la solicitud AJAX:', error);
      }
    });
  });

  $("#btn_config_account").click(()=>{
    var page = $("#btn_config_account").attr("page");
    enviarParametro(page); 
  });

  tooltipActive();
});


function enviarParametro(pagina) {
  // Redirigir la página con el parámetro
  window.location.href = 'index.html?p=' + pagina;
}

function obtenerParametro(nombre) {
  nombre = nombre.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + nombre + '=([^&#]*)');
  var resultados = regex.exec(location.search);
  return resultados === null ? '' : decodeURIComponent(resultados[1].replace(/\+/g, ' '));
}

function getPage(id) {
  if (id > 0) {
    $.ajax({
      url: '/load_menu',
      method: 'POST',
      async: true,
      data: {op:2, id:id},
      success: function(page_app) {
        $("#principal_dom").load(page_app);
      },
      error: function(error) {
          console.error('Error en la solicitud AJAX:', error);
      }
    });
  }else{
    $("#principal_dom").load("dashboard.html");
  }
}

function setMenu() {
  $.ajax({
    url: '/load_menu', // Cambia la URL según tu configuración
    method: 'POST',
    async: false,
    data: {op:1},
    success: function(data) {
      data.pages.forEach(function callback(element, index, array) {
        $("#set_menu").append(
          `<a href='#' class='nav_link' page='${element['IDPAGINA']}'> <i class='${element['ICONO']} nav_icon'></i> <span class='nav_name'>${element['DESCRIPCION']}</span></a>`
        );
      });
      $('#log_out').html(data.btn_log_out);
      $('#info_user').html(data.info_user);
    },
    error: function(error) {
        console.error('Error en la solicitud AJAX:', error);
    }
  });
}

function tooltipActive() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}
