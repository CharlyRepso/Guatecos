
$(function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});

const tarjetasContainer = document.getElementById('tarjetas-container');

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

$(document).ready(function () {
  $.ajax({
    url: '/bk_misArticulos', // Cambia la URL según tu configuración
    method: 'POST',
    data: { op: 1 },
    success: function (data) {
      datos = data.data;
      imagenes = data.images;

      loadArticulosEmpenados(datos);

      document.querySelectorAll('.set-up_config').forEach((elemento) => {
        elemento.addEventListener('click', () => {
          const id_art = elemento.getAttribute('id_art');
          const id_emp = elemento.getAttribute('id_emp');
          const valor_emp = elemento.getAttribute('valor_emp');
          const titulo_emp = elemento.getAttribute('titulo_emp');
          const cant_cuotas = elemento.getAttribute('cant_cuotas');
          const est_emp = elemento.getAttribute('estado_emp');
          const interes = elemento.getAttribute('interes');
          const meses = elemento.getAttribute('meses');
          const cuotas_emp = elemento.getAttribute('cuotas_Empeno');
          const valor_neg = elemento.getAttribute('valor_neg');
          const interes_empeno = elemento.getAttribute('interesEmpeno');
          modal_emp_setup(id_art, id_emp, valor_emp, cant_cuotas, titulo_emp, est_emp, interes, meses, cuotas_emp, valor_neg, interes_empeno);
        });
      });


    }
  });

  function loadArticulosEmpenados(data) {
    var icono = "";
    var bg = "";
    var texto = "";
    data.forEach((elemtent, index) => {

      switch (elemtent.fkEstadoEmpeno) {
        case 1: icono = `<i class='bx bx-x2 bx-book-bookmark' ></i>`; bg = `text-info`; texto = "Postulado"; break;
        case 2: icono = `<i class='bx bxs-flag-checkered' ></i>`; bg = `text-warning`; texto = "Negociación"; break;
        case 3: icono = `<i class='bx bxs-check-circle'></i>`; bg = `text-success`; texto = "Aceptado"; break;
        case 9: icono = `<i class='bx bx-trash-alt'></i>`; bg = `text-danger`; texto = "Rechazado"; break;
        case 25: icono = `<i class='bx bx-sm bx-x'></i>`; bg = `text-danger`; texto = "Anulado"; break;
      }
      $("#table_articulos_empenados").append(`
          <tr class="text-center">
              <th class="align-middle">${elemtent.titulo}</th>
              <th class="align-middle">${elemtent.descripcion}</th>
              <th class="align-middle">${elemtent.tipo}</th>
              <th class="align-middle ${bg}">${icono}</br>${texto}</th>
              <th class="align-middle"><button id_art="${elemtent.idArticulo}" id_emp="${elemtent.idEmpeno}" valor_emp="${elemtent.valor}" cant_cuotas="${elemtent.cuotasArticulo}" titulo_emp="${elemtent.titulo}" estado_emp="${elemtent.fkEstadoEmpeno}" interes="${elemtent.interesArticulo}" meses="${elemtent.meses}" cuotas_Empeno="${elemtent.cuotasEmpeno}" valor_neg="${elemtent.valorNegociacion}" interesEmpeno="${elemtent.interesEmpeno}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalles" type="button" class="btn btn-secondary set-up_config"><i class='bx bxs-cog'></i></button></th>
          </tr>
      `)
    });
  }




  function modal_emp_setup(id_art, id_emp, valor_emp, cant_cuotas, titulo_emp, est_emp, interes, meses, cuotas_emp, valor_neg, interes_empeno) {

    $("#lg_modal_title").html(`
        Gestión - Empeño
    `);
    
    const calc_interesEmpeno = parseFloat(valor_neg) * parseFloat(interes_empeno);
    const totalNegociacion = parseFloat(valor_neg) + parseFloat(calc_interesEmpeno);

    const calc_interes = valor_emp * interes;
    const total = parseFloat(valor_emp) + parseFloat(calc_interes);

    $("#lg_modal_content").html(`
        <div class='row'>
            <div class='col-6'>
            <div class="alert alert-primary">
            <p class = "h5 text-center">Información del empeño</p>
            </div>    
                <div class="form-floating mb-3 row">
                  <div class="col">
                      <p class="h6">Título del empeño:</p></div>
                  <div class="col">
                      <p class="h6">${titulo_emp}</p></div>
                  </div>
                <div class="form-floating mb-3 row">
                  <div class="col">
                  <p class="h6">Cuotas postuladas:</p>
                  </div>
                  <div class="col">
                  <p class="h6">${cant_cuotas}</p>
                  </div>
                </div>
                <div class="form-floating mb-3 row">
                <div class="col">
                <p class="h6">Precio postulado:</p>
                </div>
                <div class="col">
                <p class="h6">${CastearValor(parseFloat(valor_emp))}</p>
                </div>
                </div>
                <div class="form-floating mb-3 row">
                <div class="col">
                <p class="h6">Interés:</p>
                </div>
                <div class="col">
                <p class="h6">${CastearValor(parseFloat(calc_interes))}</p>
                </div>
                </div>
                <div class="form-floating mb-3 row">
                <div class="col">
                <p class="h6">Total:</p>
                </div>
                <div class="col">
                <p class="h6">${CastearValor(parseFloat(total))}</p>
                </div>
                </div>
            </div>
            <div class='col-6'>
            <div class="alert alert-success">
            <p class = "h5 text-center">Información de negociación</p>
            </div> 
            <div id="padNeg">
            </div>
            <div class="mb-3 d-flex justify-content-center row">
            <div id="negociacion">
            </div>
            <div class="col">
            <button type="button" class="btn btn-success" id="btnAceptar" cuotas_Empeno="${cuotas_emp}" id_emp="${id_emp}">Aceptar oferta &nbsp;<i class='bx bxs-save'></i></button>
            </div>
            <div class="col">
            <button type="button" class="btn btn-danger" id="btnRechazar" id_emp="${id_emp}">Rechazar oferta &nbsp;<i class='bx bxs-no-entry'></i></button>
            </div>
            </div>
            </div>
        </div>
    `);


    function divsNegociados(alert) {
      document.getElementById('padNeg').innerHTML = `
      <div class="form-floating mb-3 row">
        <div class="col">
          <p class="h6">Cuotas negociadas:</p>
        </div>
      <div class="col">
          <p class="h6">${cuotas_emp}</p>
      </div>
      </div>
      <div class="form-floating mb-3 row">
        <div class="col">
          <p class="h6">Valor negociado:</p>
        </div>
        <div class="col">
          <p class="h6">Q ${valor_neg}</p>
        </div>
      </div>
      <div class="form-floating mb-3 row">
      <div class="col">
        <p class="h6">Interés:</p>
      </div>
      <div class="col">
        <p class="h6">${CastearValor(parseFloat(calc_interesEmpeno))}</p>
      </div>
    </div>
      <div class="form-floating mb-3 row">
      <div class="col">
        <p class="h6">Total:</p>
      </div>
      <div class="col">
        <p class="h6">${CastearValor(parseFloat(totalNegociacion))}</p>
      </div>
    </div>
      ${alert}
      `;
    }

    if (est_emp == 2) {
      document.getElementById('btnAceptar').style.display = 'block';
      document.getElementById('btnRechazar').style.display = 'block';
      divsNegociados("");

      document.getElementById('btnAceptar').addEventListener('click', e => {
        e.preventDefault();

        const idEmpeno = e.target.getAttribute('id_emp');
        const cuotasEmpeno = e.target.getAttribute('cuotas_Empeno');

        var formData = {
          id_emp: idEmpeno,
          cuotas_Empeno: cuotasEmpeno
        };

        createNewEmpeno(formData);

        window.location.reload(true);

      });

      document.getElementById('btnRechazar').addEventListener('click', e => {
        e.preventDefault();

        const idEmpeno = e.target.getAttribute('id_emp');
        var formData = {
          id_emp: idEmpeno,
        };

        rejectEmpeno(formData);

        window.location.reload(true);

      });
    } else if (est_emp == 3) {
      const alert = `
      <br>
      <br>
      <div class="alert alert-info">
      <p  class="text-center h1"><i class='bx bxs-check-circle'></i></p>
      <p class = "h5 text-center">¡Negociación Aceptada!</p>
      </div>`;
      document.getElementById('btnAceptar').style.display = 'none';
      document.getElementById('btnRechazar').style.display = 'none';
      divsNegociados(alert);

    } else if (est_emp == 9) {
      const alert = `
      <br>
      <br>
      <div class="alert alert-danger">
      <p  class="text-center h1"><i class='bx bx-trash-alt'></i></p>
      <p class = "h5 text-center">¡Negociación Rechazada!</p>
      </div>`;
      document.getElementById('btnAceptar').style.display = 'none';
      document.getElementById('btnRechazar').style.display = 'none';
      divsNegociados(alert);

    }
    else if(est_emp == 25){
      const alert = `
      <br>
      <br>
      <div class="alert alert-danger">
      <p  class="text-center h1"><i class='bx bx-sm bx-x'></i></p>
      <p class = "h5 text-center">¡Empeño Anulado!</p>
      </div>`;
      document.getElementById('btnAceptar').style.display = 'none';
      document.getElementById('btnRechazar').style.display = 'none';
      divsNegociados(alert);
    }
    else {
      document.getElementById('btnAceptar').style.display = 'none';
      document.getElementById('btnRechazar').style.display = 'none';
      document.getElementById('negociacion').innerHTML = `
      <div class="alert alert-warning text-center" role="alert">
      Datos aún en verificación <i class='bx bxs-pie-chart-alt'></i>
      </div>`;
    }

    $("#lg_modal").modal('show');
  }


  $.ajax({
    url: '/bk_misArticulos', // Cambia la URL según tu configuración
    method: 'POST',
    data: { op: 2 },
    success: function (data) {
      loadArticulosComprados(data);
      function loadArticulosComprados(data) {
        var icono = "";
        var icono2 = "";
        var bg = "";
        var bg2 = "";
        var texto = "";
        data.forEach((elemtent, index) => {

          switch (elemtent.estado_compra) {
            case "Solcitado": icono = `<i class='bx bx-x2 bx-book-bookmark'></i>`; bg = `text-info`; break;
            case "Aprovado": icono = `<i class='bx bxs-flag-checkered' ></i>`; bg = `text-success`; texto = "Aprobado"; break;
          }
          switch (elemtent.estado_pago) {
            case "Reemboloso": icono2 = `<i class='bx bx-log-out-circle'></i>`; bg2 = `text-info`; break;
            case "Autorizado": icono2 = `<i class='bx bxs-flag-checkered' ></i>`; bg2 = `text-success`; break;
            case "No autorizado": icono2 = `<i class='bx bx-trash-alt'></i>`; bg2 = `text-warning`; break;
            case "Verficado": icono2 = `<i class='bx bxs-check-circle'></i>`; bg2 = `text-success`; break;
          }
          $("#table_articulos_comprados").append(`
              <tr class="text-center">
                  <th class="align-middle">${elemtent.titulo}</th>
                  <th class="align-middle">${elemtent.descripcion}</th>
                  <th class="align-middle">${elemtent.comentario == null ? "N/A" : elemtent.comentario}</th>
                  <th class="align-middle ${bg}">${icono}</br>${elemtent.estado_compra}</th>
                  <th class="align-middle ${bg2}">${icono2}</br>${elemtent.estado_pago}</th>
              </tr>
          `)
        });
      }

    }
  });

  function createNewEmpeno(data) {
    $.ajax({
      url: '/bk_misArticulos',
      method: 'POST',
      async: false,
      data: { op: 3, data: data },
      success: function (data) {
      },
      error: function (error) {
        console.error('Error en la solicitud AJAX:', error);
      }
    });
  }

  function rejectEmpeno(data) {
    $.ajax({
      url: '/bk_misArticulos',
      method: 'POST',
      async: false,
      data: { op: 4, data: data },
      success: function (data) {
        //console.log(data);
      },
      error: function (error) {
        console.error('Error en la solicitud AJAX:', error);
      }
    });
  }


  const CastearValor = (numero) => {
    return numero.toLocaleString("es-GT", { style: "currency", currency: "GTQ" });
  }

});


