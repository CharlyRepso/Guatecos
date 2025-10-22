$('#principal_dom').addClass('justify-content-center align-self-center d-flex');
tooltipActive();

//LLENAMOS EL FORMULARIO DE DATOS GENERALES
$.ajax({
    url: '/bk_configurarCuenta',
    method: 'POST',
    async: true,
    data: {op: 1},
    success: function(data) {
        console.log(data);
        /*$("#input_firstName").val(data[0].nombre);
        $("#input_lastName").val(data[0].apellido);
        $("#input_userName").val(data[0].userName);
        $("#input_address").val(data[0].direccion);
        $("#input_email").val(data[0].correo);
        $("#input_phone").val(data[0].telefono);*/
    },
    error: function(error) {
        console.error('Error en la solicitud AJAX:', error);
    }
});

//MANDAMOS LA INFORMACIÓN PARA ACTUALIZAR
document.getElementById('form_data').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    Swal.fire({
        title: '¿Renovar Datos?',
        text: "Su información sera cambiada de forma permante.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            updateData(data);
        }
    });
});

//MANDAMOS LAS CONTRASEÑAS PARA SU VALIDACION Y ACTUALIZACION
document.getElementById('form_password').addEventListener('submit', e => {
    e.preventDefault();
    let cancelar = false 
    const data = Object.fromEntries(new FormData(e.target));
    if (data.newPassword === data.repeatPassword) {
        Swal.fire({
            title: '¿Renovar Contraseña?',
            text: "Su contraseña sera cambiada de forma permante.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                updatePassword(data);
            }
        });
    }
    else{
        Swal.fire({
            icon: 'error',
            title: `Oops...!`,
            html: `<ol class="list-group"><li class="list-group-item list-group-item-action list-group-item-warning">Las contraseñas ingresadas <b>no coinciden</b> por favor, verifique e <b>intente de nuevo.</b></li></ol>`
        });
    }
});

function updatePassword(data){
    $.ajax({
        url: '/bk_configurarCuenta',
        method: 'POST',
        async: true,
        data: {
            data: data,
            op: 3
        },
        success: function(data) {
            console.log(data);
            if (data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Contraseña Actualizada Correctamente!',
                }).finally(() => {
                    location.reload();
                });
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: `Oops...!`,
                    html: `<ol class="list-group"><li class="list-group-item list-group-item-action list-group-item-warning">La contraseña actual es <b>incorrecta</b> por favor, verifique e <b>intente de nuevo.</b></li></ol>`
                });
            }
        }
    });
}

function updateData(data){
    let message = "";
    $.ajax({
        url: '/bk_configurarCuenta',
        method: 'POST',
        async: true,
        data: {
            data: data,
            op: 2
        },
        success: function(data) {
            if (data.userName) {
                message +=`<li class="list-group-item list-group-item-action list-group-item-warning">El <b>nombre de usuario</b> ya esta en uso, <b>escoja otro nombre.</b></li>`;
            }
            if (data.email) {
                message += `<li class="list-group-item list-group-item-action list-group-item-warning">El <b>correo electronico</b> ingresado ya esta siendo utilizado, <b>ingrese otro.</b></li>`;
            }

            if (!data.userName && !data.email) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos Actualizados Correctamente!',
                }).finally(() => {
                    location.reload();
                  });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: `Oops...!`,
                    html: `<ol class="list-group">${message}</ol>`
                });
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });
}


  