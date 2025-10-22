
$(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  });

$.ajax({
    url: '/bk_artConsignados',
    method: 'POST',
    async: false,
    data: {op: 1},
    success: function(data) {
       loadArt_Consingados(data.data_art);
       loadAll_sales(data.data_sale);
    },
    error: function(error) {
        console.error('Error en la solicitud AJAX:', error);
    }
});

function loadArt_Consingados(data) {
    data.forEach((elemtent, index) => {
        $("#table_articulos_consignados").append(`
            <tr class="text-center">
                <th class="align-middle">${elemtent.titulo}</th>
                <th class="align-middle">${elemtent.descripcion}</th>
                <th class="align-middle">${elemtent.tipo}</th>
                <th class="align-middle"><button id_art="${elemtent.idArticulo}"  id_emp="${elemtent.idEmpeno}"data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalles" type="button" class="btn btn-secondary open-details"><i class='bx bxs-cog'></i></button></th>
            </tr>
        `)
    });
}
function loadAll_sales(data) {
    var icono = "";
    var bg ="";
    data.forEach((elemtent, index) => {
        switch (elemtent.idEstado) {
            case 11: icono = `<i class='bx bx-x2 bx-book-bookmark' ></i>`; bg=`text-info`; break;
            case 12: icono = `<i class='bx bx-x2 bxs-flag-checkered' ></i>`; bg=`text-success`; break;
            case 13: icono = `<i class='bx bx-x2 bx-trash-alt' ></i>`; bg=`text-danger`; break;
            case 14: icono = `<i class='bx bx-x2 bxs-purchase-tag' ></i>`; bg=`text-primary`; break;
        }
        $("#table_ventas_general").append(`
            <tr class="text-center">
                <th class="align-middle">${elemtent.titulo}</th>
                <th class="align-middle">${elemtent.descripcion}</th>
                <th class="align-middle">${new Date(elemtent.fecha).toLocaleDateString()}</th>
                <th class="align-middle">${elemtent.precio}</th>
                <th class="align-middle ${bg}">${icono}</br>${elemtent.estado}</th>
                <th class="align-middle"><button id_ven="${elemtent.idVenta}"  id_comp="${elemtent.idCompra}" id_est="${elemtent.idEstado}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Detalles" type="button" class="btn btn-secondary set-up_config"><i class='bx bxs-cog'></i></button></th>
            </tr>
        `)
    });
}


document.querySelectorAll('.open-details').forEach((elemento) => {
    elemento.addEventListener('click', () => {
        const id_art = elemento.getAttribute('id_art');
        const id_emp = elemento.getAttribute('id_emp');
        modal_details(id_art, id_emp);
    });
});

document.querySelectorAll('.set-up_config').forEach((elemento) => {
    elemento.addEventListener('click', () => {
        const id_comp = elemento.getAttribute('id_comp');
        const id_ven = elemento.getAttribute('id_ven');
        const id_est = elemento.getAttribute('id_est');
        modal_sales_setup(id_comp, id_ven, id_est);
    });
});

function modal_details(id_art, id_emp) {
    $("#lg_modal_title").html(`
        Agregar - Nueva Venta
    `);

    $("#lg_modal_content").html(`
        <div class='row'>
            <div class='col-4'>
                <div class="input-group input-group-sm flex-nowrap mb-3">
                    <span class="input-group-text" id="lb_cuota">Cuotas Pagadas</span>
                    <input type="number" class="form-control"  aria-describedby="lb_cuota" id="input_cuotas" disabled>
                </div>
            </div>
            <div class='col'>
                <div class="input-group input-group-sm flex-nowrap mb-3">
                    <span class="input-group-text" id="lb_inversio">Inversion Q.</span>
                    <input type="number" class="form-control"  aria-describedby="lb_inversio" id="input_inversion" disabled>
                </div>
            </div>
            <div class='col'>
                <div class="input-group input-group-sm flex-nowrap mb-3">
                    <span class="input-group-text" id="lb_recuperacion">Recuperació Q.</span>
                    <input type="number" class="form-control"  aria-describedby="lb_recuperacion" id="input_recuperacion" disabled>
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='col-6 d-flex justify-content-center'>
                <div class="card" style="width: 20rem; border-style: solid 5px;">
                    <div class="swiper">
                        <div class="swiper-wrapper" id="art-pictures">
                        </div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-scrollbar"></div>
                    </div>
                </div>
            </div>
            <div class='col-6'>
                <form id="form_new_sale" id_art="${id_art}"  id_emp="${id_emp}">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Titulo de la Venta" required>
                        <label for="titulo">Titulo de la Venta</label>
                    </div>
                    <div class="form-floating mb-3">
                        <textarea class="form-control" placeholder="Descripción" id="descripcion" name="descripcion" required></textarea>
                        <label for="descripcion">Descripción</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="precio" name="precio" placeholder="Titulo de la Venta" required>
                        <label for="precio">Precio de la Venta Q.</label>
                    </div>
                    <div class="mb-3 d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary">Crear Venta <i class='bx bx-plus-medical'></i></button>
                    </div>
                </form>
            </div>
        </div>
    `);

    $("#lg_modal").modal('show');

    $.ajax({
        url: '/bk_artConsignados',
        method: 'POST',
        async: false,
        data: {op: 2, id_art:id_art, id_emp:id_emp},
        success: function(data) {
            var imagenes = data.imagenes;
            data[0].imagenes.forEach(element => {
                $("#art-pictures").append(`<div class="swiper-slide"><img class="img" src="${element.Imagen}"></div>`);
            });
            $("#input_cuotas").val(data[0].pagadas);
            $("#input_inversion").val(data[0].inversion);
            $("#input_recuperacion").val(data[0].recuperacion);
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });

    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
    
    document.getElementById('form_new_sale').addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        const id_art = e.target.getAttribute('id_art');
        const id_emp = e.target.getAttribute('id_emp');
        formData.append('id_art',id_art);
        formData.append('id_emp',id_emp);
        create_new_sale(Object.fromEntries(formData))
    });
}

function create_new_sale(data) {
    $.ajax({
        url: '/bk_artConsignados',
        method: 'POST',
        async: false,
        data: {op: 3, data:data},
        success: function(data) {
            if (data.check) {
                Swal.fire(
                    'Venta Creada!',
                    'el articulo se ha puesto en venta, en el portal.',
                    'success'
                ).finally(() => {
                    location.reload();
                });
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });
}


function modal_sales_setup(id_comp, id_ven, id_est) {
    var id_pago;
    $("#lg_modal_title").html(`
        Gestion - Venta
    `);

    $("#lg_modal_content").html(`
        <div class='row'>
            <div class='col-6'>
                <div class="alert alert-warning" role="alert">
                    <h5 class='text-center'>Información de Compra</5>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="banco" placeholder="" disabled>
                    <label for="banco">Banco</label>    
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="tipo_pago" placeholder="" disabled>
                    <label for="tipo_pago">Tipo de Pago</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="documento"  placeholder="" disabled>
                    <label for="documento">Numero de Documento</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="pagado" placeholder="" disabled>
                    <label for="pagado">Monto Q.</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="nit" placeholder="" disabled>
                    <label for="nit">NIT</label>
                </div>
                <div class="form-floating mb-3">
                    <textarea class="form-control" placeholder="" id="direccion" style="height: 100px; resize: none;" disabled></textarea>
                    <label for="direccion">Direccion de Entrega</label>
                </div>
            </div>
            <div class='col-6'>
                <div class="alert alert-success" role="alert">
                    <h5 class='text-center'>Información de Venta</5>
                </div>
                <form id="form_up_sale"  id_ven="${id_ven}">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Titulo de la Venta" required>
                        <label for="titulo">Titulo de la Venta</label>
                    </div>
                    <div class="form-floating mb-3">
                        <textarea class="form-control" placeholder="Descripción" id="descripcion" name="descripcion" required></textarea>
                        <label for="descripcion">Descripción</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="precio" name="precio" placeholder="Titulo de la Venta" required>
                        <label for="precio">Precio de la Venta Q.</label>
                    </div>
                    <div class="mb-3 d-flex justify-content-center">
                        <button type="submit" id="btn_save" class="btn btn-info">Guardar Cambios &nbsp;<i class='bx bxs-save'></i></button>
                    </div>
                </form>
                <div class="mb-3 d-flex justify-content-center">
                    <button id="btn_delete" id_ven="${id_ven}" type="button" class="btn btn-danger">Eliminar Venta&nbsp;<i class='bx bxs-trash-alt'></i></button>
                </div>
                <div class="mb-3" id="last_message">
                    <div class="mb-3 d-flex justify-content-center">
                        <button id="btn_apro_comp" id_comp="${id_comp}" type="button" class="btn btn-success">Aprobar Compra&nbsp;<i class='bx bxs-like' ></i></button>
                    </div>
                    <div class=" mb-3 d-flex justify-content-center">
                        <button id="btn_dismi_comp" id_comp="${id_comp}" type="button" class="btn btn-danger">Rechazar Compra&nbsp;<i class='bx bxs-x-circle'></i></button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $("#lg_modal").modal('show');

    $.ajax({
        url: '/bk_artConsignados',
        method: 'POST',
        async: false,
        data: {op: 4, id_comp:id_comp, id_ven:id_ven},
        success: function(data) {
            var venta = data.data_venta[0];
            $("#titulo").val(venta.titulo);
            $("#descripcion").val(venta.descripcion);
            $("#precio").val(venta.precio);
            
            if (data.data_compra.length > 0) {
                var compra = data.data_compra[0];
                id_pago = compra.idPago;
                $("#banco").val(compra.banco);
                $("#tipo_pago").val(compra.tipo_pago);
                $("#documento").val(compra.numeroDocumento);
                $("#pagado").val(compra.monto);
                $("#nit").val(compra.nit);
                $("#direccion").val(compra.direccion);
                $("#btn_delete").remove();
                $("#btn_save").remove();
            }else{
                $("#btn_apro_comp").remove();
                $("#btn_dismi_comp").remove();
            }

            console.log(id_est)
            if (parseInt(id_est) == 13 ) {
                $("#btn_delete").remove();
                $("#btn_save").remove();
                $("#last_message").html(`
                    <div class="alert alert-danger" role="alert">
                        <h1 class="text-center"><i class='bx bx-x3 bxs-x-circle'></i></h1>
                        <h5 class="text-center">LA VENTA HA SIDO ELIMINADA.</h5>
                    </div>
                `)
            }
            if (parseInt(id_est) == 12 ) {
                $("#btn_delete").remove();
                $("#btn_save").remove();
                $("#last_message").html(`
                    <div class="alert alert-success" role="alert">
                        <h1 class="text-center"><i class='bx bxs-check-circle'></i></h1>
                        <h5 class="text-center">LA VENTA HA SIDO FINALIZADA.</h5>
                    </div>
                `)
            }
    
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });

    //ACTUALIZAR DATOS DE VENTA.
    document.getElementById('form_up_sale').addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        const id_ven = e.target.getAttribute('id_ven');
        formData.append('id_ven',id_ven);
        edit_sale(Object.fromEntries(formData));
    });

    //ELIMINAR VENTA
    $("#btn_delete").click(()=>{
        let id_sale = $('#btn_delete').attr("id_ven");
        delete_sale(id_sale);
    });

    //APROBAR COMPRA
    $("#btn_apro_comp").click(()=>{
        let id_compra = $('#btn_apro_comp').attr("id_comp");
        aprove_buy(id_compra, id_pago);
    });

    //RECHAZAR COMPRA.
    $("#btn_dismi_comp").click(()=>{
        let id_compra = $('#btn_dismi_comp').attr("id_comp");
        dismi_buy(id_compra, id_pago, id_ven);
    })
}

function aprove_buy(id_compra, id_pago) {
    Swal.fire({
        title: '¿Desea aprovar la compra?',
        text: "Esto garantiza que los dato, de pago, y entrega han sido verificados correctamente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Aprobar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/bk_artConsignados',
                method: 'POST',
                async: false,
                data: {op: 5, id_comp:id_compra, id_pago: id_pago},
                success: function(data) {
                    console.log(data);
                    if (data.check) {
                        Swal.fire(
                            'Compra Aprovada!',
                            'La compra ha sido aprovado, exitosamente',
                            'success'
                        ).finally(() => {
                            location.reload();
                        });
                    }
                    else{
                        Swal.fire(
                            'Error al aprovar la compra!',
                            'Comuniquese al Soporte Tecnico.',
                            'error'
                        )
                    }
                }
            });
        }
    })

}

function edit_sale(dataForm) {
    Swal.fire({
        title: '¿Desea actualizar la venta?',
        text: "La información sera reemplazada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/bk_artConsignados',
                method: 'POST',
                async: false,
                data: {op: 6, dataForm:dataForm},
                success: function(data) {
                    if (data.check) {
                        Swal.fire(
                            'Venta Editada!',
                            'La información a sido actualizada.',
                            'success'
                        ).finally(() => {
                            location.reload();
                        });
                    }
                }
            });
        }
    })
    
}

function delete_sale(id_sale) {
    Swal.fire({
        title: '¿Desea eliminar la venta?',
        text: "La venta será removida y el articulo regresará a consignado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#198754',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/bk_artConsignados',
                method: 'POST',
                async: false,
                data: {op:7, id_sale:id_sale},
                success: function(data) {
                    if (data.check) {
                        Swal.fire(
                            'Venta Elimada!',
                            'La venta ha sido removida.',
                            'success'
                        ).finally(() => {
                            location.reload();
                        });
                    }
                }
            });
        }
    });
}

function dismi_buy(id_compra, id_pago, id_ven) {
    Swal.fire({
        target: '#lg_modal',
        title: '¿Rechazar Compra? ',
        input: 'textarea',
        html: `
            <i class='text-danger bx bx-x4 bx-message-alt-error'></i>
            <ul class="list-group">
                <li class="list-group-item list-group-item-warning">La solicitud sera rechazada, por el motivo:</br><b>(Escriba un comentario)</b></li>
            </ul>
        `,
        inputAttributes: {
            required: 'true'
        },
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value === '') {
                    resolve('Debes escribir un comentario');
                } else {
                    resolve();
                }
            });
        },
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#198754',
        confirmButtonText: 'Rechazar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: false,
    }).then((result) => {
        if (result.isConfirmed) {
            var comentario = result.value;
            $.ajax({
                url: '/bk_artConsignados',
                method: 'POST',
                async: false,
                data: {op:8, comentario:comentario, id_compra: id_compra, id_pago:id_pago, id_ven:id_ven},
                success: function(data) {
                    if (data.check) {
                        Swal.fire(
                            'Compra rechazada!',
                            'La compra ha sido rechazada y la venta se ha publicado nuevamente.',
                            'success'
                        ).finally(() => {
                            location.reload();
                        });
                    }
                }
            });
        }
    });
}