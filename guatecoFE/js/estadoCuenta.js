
$(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});


$(document).ready(function () {
    $.ajax({
        url: '/bk_estadoCuenta',
        method: 'POST',
        async: false,
        data: { op: 1 },
        success: function (data) {
            //console.log(data);
          
            loadConsultaPagos(data);
            

            document.querySelectorAll('.abrir-modal').forEach((elemento) => {
                elemento.addEventListener('click', () => {
                    const idPago = elemento.getAttribute('id_pago');
                    const interes = elemento.getAttribute('interes');
                    const meses = elemento.getAttribute('meses');
                    const cantidadTotal = elemento.getAttribute('cantidadTotal');
                    const estadoPago = elemento.getAttribute('estado');
                    setPagoState(idPago, interes, meses, cantidadTotal, estadoPago);
                });
            });
        },
        error: function (error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });
});

function loadConsultaPagos(data) {
    var icono = "";
    var bg = "";
    var text = "";

    data.forEach((element, index) => {
        switch (element.estadoPago) {
            case 18: icono = `<i class='bx bx-sm bxs-timer'></i>`; bg = `text-warning`; text = 'Pendiente'; break;
            case 19: icono = `<i class='bx bx-sm bxs-check-circle'></i>`; bg = `text-success`; text = 'Pagada'; break;
            case 20: icono = `<i class='bx bx-sm bx-calendar-exclamation' ></i>`; bg = `text-danger`; text = 'Vencida'; break;
        }
        $('#table_consulta_pagos').append(`
        <tr class="text-center">
        <th class="align-middle">${element.fechaPago == null ? 'N/A' : new Date(element.fechaPago).toLocaleDateString()}</th>
        <th class="align-middle">${new Date(element.fechaVencimiento).toLocaleDateString()}</th>
        <th class="align-middle">${element.numeroDocumento == null ? 'N/A' : element.numeroDocumento}</th>
        <th class="align-middle ${bg}">${icono}</br>${text}</th>
        <th class="align-middle"><button id_pago="${element.idPago}" id_emp="${element.fkEmpeno}" interes="${element.interes}" meses="${element.meses}" cantidadTotal="${element.cantidadTotal}" estado="${element.estadoPago}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalles" type="button" class="btn btn-secondary abrir-modal"><i class='bx bxs-cog'></i></button></th>
    </tr>
        `);
    });
}

function setPagoState(id, interes, meses, cantidadTotal, estadoPago) {

    const cuotaTotal = parseFloat(cantidadTotal) / parseFloat(meses);
    console.log(cuotaTotal);
    $("#lg_modal_title").html(`
        Formulario - Pago
    `);

    if (estadoPago == 18 && 20) {
        $("#lg_modal_content").html(`
        <form id="form_pago" id_pago="${id}" numeroDocumento="numDoc">
            <div class="row mb-2">
                <div class= "col-6">
                    <div class="form-floating">
                        <select class="form-select" id="banco" name="banco"required>
                            <option selected disabled value=''>...</option>
                            <option value="Banrural">Banrural</option>
                            <option value="BI">BI</option>
                            <option value="BAC">BAC</option>
                            <option value="Promerica">Promerica</option>
                        </select>
                        <label for="banco">Banco</label>
                    </div>
                </div>
                <div class= "col-6">
                    <div class="form-floating">
                        <select class="form-select" id="tipo_pago" name="tipo_pago" required>
                            <option selected disabled value=''>...</option>
                            <option value="1">Deposito</option>
                            <option value="2">Tranferencia</option>
                        </select>
                        <label for="tipo_pago">Seleccione Tipo de Pago</label>
                    </div>
                </div>
  
            </div>
            <div class="row mb-2">
            <div class= "col-6">
            <div class="form-floating">
                <input value="" type="text" class="form-control" id="numDoc" placeholder="Número de Documento" name="numDoc"required>
                <label for="numDoc">Número de Documento</label>
            </div>
        </div>
                <div class= "col-6">
                    <div class="form-floating">
                        <input value="${cuotaTotal.toFixed(2)}" type="number" class="form-control" id="valPagado"  placeholder="Total a Pagar" name="valPagado" readonly required>
                        <label for="valPagado">Total a Pagar</label>
                    </div>
                </div>
            </div>
            <div class="row d-flex justify-content-center">
                <div class="col-3">
                    <button type="submit" class="btn btn-success align-middle"><i class='bx bxs-shopping-bag'></i>&nbsp;&nbsp;Pagar</button>
                </div>
            </div>
        </form>
    `)
    } 
    else if(estadoPago == 20){
        $("#lg_modal_content").html(`
        <div class="row mb-2">
        <div class="alert alert-danger">
        <p  class="text-center h1"><i class='bx bx-lg bx-calendar-exclamation' ></i></p>
        <p class = "h5 text-center">Cuota vencida.</p>
        <p class = "h5 text-center">Comuniquese al servicio al cliente.</p>
        </div>
        </div>`)
    }else {
        $("#lg_modal_content").html(`
        <div class="row mb-2">
        <div class="alert alert-success">
        <p  class="text-center h1"><i class='bx bxs-check-circle'></i></p>
        <p class = "h5 text-center">Pagado Exitosamente!</p>
        </div>
        </div>`);
    }

    $("#lg_modal").modal('show');

    document.getElementById('form_pago').addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target;

        var formData = new FormData(form)
        const idPago = form.getAttribute('id_pago');
        const valor = document.getElementById('numDoc');
        var numeroDocumento = valor.value;
        formData.append('op', 2);
        formData.append('idPago', idPago);
        formData.append('numeroDocumento', numeroDocumento);
        data = Object.fromEntries(formData);

        console.log(data);
        Swal.fire({
            title: 'Confirmar Pago?',
            text: "Al aceptar estás confirmando que los datos son correctos. Si alguno de estos es inconsistente o irregular, tu solicitud no puede ser rechaza. Y podrías perder tu dinero.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                sendRequest(data);
            }
        });

    });
}

function sendRequest(data) {
    $.ajax({
        type: 'POST',
        url: '/bk_estadoCuenta',
        data: data,
        async: true,
        success: function (response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Formulario Enviado!',
                text: 'Su Solcitud ha sido enviada con éxito.',

            }).finally(() => {
                //enviarParametro(6);
                location.reload();
            });
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group">${error.statusText}</ol>`
            });
        }
    });
}