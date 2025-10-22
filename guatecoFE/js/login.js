$('#principal_dom').addClass('justify-content-center align-self-center d-flex');


$('#btn_log_in').click(function () {
    var user = $('#input_user').val();
    var password = $('#input_password').val();

    $.ajax({
        url: '/sessionManager', // Cambia la URL según tu configuración
        method: 'POST',
        async: true,
        data: {op:1, user:user, password:password},
        success: function(data) {
            if (data == 'true') {
                window.location.href = 'index.html';
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar Sesion',
                    text: 'Verifique su nombre de usuario y contraseña'
                  })
            }
        },
        error: function(error) {
            console.error('Error en la solicitud AJAX:', error);
        }
    });
});

$("#forgot_password").click(()=>{
    $("#sm_modal").modal("show");
    $("#sm_modal_title").html(`Recuperación de Contraseña`)

    $("#sm_modal_content").html(`
        <form id="form_recovery">
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="email" name="email" placeholder="Correo Electronico" required>
                <label for="email">Correo Electronico</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="userName" name="userName" placeholder="Nombre de Usuairo" required>
                <label for="userName">Nombre de usuario</label>
            </div>
            <div class="mb-2 d-flex justify-content-center">
                <button type="submit" class="btn btn-info">Solicitar Recuperación <i class='bx bx-reset'></i></button>
            </div>
        </form>
    `);

    document.getElementById('form_recovery').addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(e.target)
        var dataRecovery = Object.fromEntries(formData);
        $.ajax({
            url: '/sessionManager', // Cambia la URL según tu configuración
            method: 'POST',
            async: true,
            data: {op:3, dataRecovery:dataRecovery},
            success: function(data) {
                if (data.check) {
                    Swal.fire({
                        html: `
                            <h5>Solicitud de recuperacion Evniada</h5>
                            <i class='text-primary bx bx-lg bx-mail-send'></i></br>
                            <h6>Esta solicitud puede tardar un periodo de 24 a 72 horas en ser respondida, pronto recibirá un correo con sus nuevas credenciales.</h6>
                        `,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#28a745'
                    }).finally(() => {
                        location.reload();
                    });
                }
                else{
                    if (data.found) {
                        if (data.active) {
                            if (data.recovery) {
                                Swal.fire({
                                    html: `
                                        <h5><b>Error</b> al enviar la solicitud.</h5>
                                        <i class='text-success bx bx-lg bxs-envelope'></i></br><i class='bx '>
                                        <h6>Su usuario ya tiene una solicitud, emitida.</h6>
                                    `,
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#28a745'
                                });
                            }  
                        }
                        else{
                            Swal.fire({
                                html: `
                                    <h5><b>Error</b> al enviar la solicitud.</h5>
                                    <i class='text-danger bx bx-lg bx-user-x'></i></br>
                                    <h6>Su usuario se encuentra inactivo, comuníquese con servicio al cliente para más información</h6>
                                `,
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: '#28a745'
                            });
                        }
                    }
                    else{
                        Swal.fire({
                            html: `
                                <h5><b>Error</b> al enviar la solicitud.</h5>
                                <i class='text-danger bx-lg bx bx-x'></i><i class='text-danger bx bx-lg bx-search'></i></br>
                                <h6>No se encontro el usuario o correo asociados</h6>
                            `,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#28a745'
                        });
                    }
                }
            },

        });
    });
});