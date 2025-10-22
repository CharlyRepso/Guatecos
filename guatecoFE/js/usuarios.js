$.ajax({
    url: '/bk_usuarios', // Cambia la URL según tu configuración
    method: 'POST',
    async: false,
    data: {op:1},
    success: function(data) {
        data.forEach((element, index) => {
            var state_recovery = "";
            var state_user = "";
            var check = "";

            switch (element.recuperar) {
                case 1: state_recovery = `<button type="button" class="reset_password btn btn-info" id_user =${element.idUser}><i class='bx bx-sm bx-key'></i></button>`; break;
                case 0: state_recovery = "<i class='text-success bx bx-sm bxs-lock '></i>"; break;
            }

            switch (element.estado) {
                case "Activo":
                    state_user = "Inhabilitar usuario";
                    check = "checked";
                break;
                case "Inactivo":
                    state_user = "Habilitar usuario";
                break;
            }

            $("#user_table_body").append(`
            <tr>
                <td class="align-middle">${element.nombre_completo}</td>
                <td class="align-middle">${element.userName}</td>
                <td class="align-middle">${element.telefono}</td>
                <td class="align-middle">${element.direccion}</td>
                <td>
                    <select class="form-select change-rol" id="select_tuser_${index}" id_user="${element.idUser}">
                        <option value="2">Nomral</option>
                        <option value="3">Administrador</option>
                    </select>
                </td>
                <td class="align-middle">${element.estado == 'Activo' ? `<h6 class="text-success"><i class='bx bx-sm bx-user-check' ></i>&nbsp;&nbsp;Activo</h6>`: `<h6 class="text-danger"><i class='bx bx-sm bx-user-x'></i>&nbsp;&nbsp;Inactivo</h6>`}</td>
                <td class="align-middler">${state_recovery}</td>
                <td class="align-middle">
                    <div class="form-check form-switch">
                        <input class="change_state form-check-input" type="checkbox" role="switch" id_user="${element.idUser}" id="active_user_${index}" ${check}>
                        <label class="form-check-label" for="active_user_${index}" >${state_user}</label>
                    </div>
              </td>
            </tr>
            `)
            $(`#select_tuser_${index}`).val(element.tp_user);
        });


        $("#user_table").DataTable({
            responsive: true,
            stateSave: false,
            "lengthChange": false,
            "pageLength": 20,
            "language": {
                "search": "Buscar:",
                "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
                }
            },
            fnDrawCallback : function() {
                $(".change_state").change(event => {
                    var user_id = $(event.target).attr("id_user");
                    var estado = $(event.target).prop("checked");
                    change_state(estado, user_id);
                });

                $(".change-rol").change(event => {
                    var user_id = $(event.target).attr("id_user");
                    var rol = $(event.target).val();
                    change_rol(user_id, rol);
                });
            }
        });
    },
    error: function(error) {
        console.error('Error en la solicitud AJAX:', error);
    }
});

document.querySelectorAll('.reset_password').forEach((elemento) => {
    elemento.addEventListener('click', () => {
        const id_user = elemento.getAttribute('id_user');
        reset_password(id_user);
    });
});


function change_state(estado, user_id) {
    
    var change;
    if(estado){
        change = "habilito"
        estado = 1;
    }
    else{
        change = "inhabilitó"
        estado = 0;
    }

    $.ajax({
        type: 'POST',
        url: '/bk_usuarios',
        data: {op: 2, user_id:user_id, estado:estado},
        success: function(data) {
            if (data.check) {
                Swal.fire({
                    icon: 'success',
                    title: `El usuario se ${change}`,
                }).finally(() => {
                    location.reload();
                });

            }
        },
        error: function(error) {
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group">${error}</ol>`
            });
        }
    });
}


function change_rol(user_id, rol){
    $.ajax({
        type: 'POST',
        url: '/bk_usuarios',
        data: {op: 3, user_id:user_id, rol:rol},
        success: function(data) {
            if (data.check) {
                Swal.fire({
                    icon: 'success',
                    title: `El usuario a cambiado de rol.`,
                }).finally(() => {
                    location.reload();
                });

            }
        },
        error: function(error) {
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group">${error}</ol>`
            });
        }
    });
}

function reset_password(user_id){
    $("#lg_modal_title").html(`Reinicio de Contraseña`);
    $("#lg_modal_content").html(`
    <form id="form_password">
        <div class="card">
            <div class="card-body">
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="first_password" name = "first_password" placeholder="" required>
                    <label for="first_password">Ingrese la nueva Contraseña</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="second_password" name ="second_password" placeholder="" required>
                    <label for="second_password">Repita la nueva Contraseña</label>
                </div>

            </div>
            <div class="card-footer d-flex justify-content-center">
                <button type="submit" class="btn btn-secondary"><i class='bx bx-sm bx-reset'></i>&nbsp;&nbsp;Reiniciar Contraseña</button>
            </div>
        </div>
    </form>
    `);
    $("#lg_modal").modal(`show`);

    document.getElementById('form_password').addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(e.target);
        var dataPassword = Object.fromEntries(formData);

        if (formData.first_password == formData.second_password) {           
            $.ajax({
                type: 'POST',
                url: '/bk_usuarios',
                async: false,
                data: {op: 4, user_id:user_id, dataPassword:dataPassword},
                success: function(data) {
                    console.log(data);
                    if (data.check) {
                        Swal.fire({
                            icon: 'success',
                            title: `La contraseña se ha actualizado con exito!.`,
                        }).finally(() => {
                            location.reload();
                        });
                    }
                },
                error: function(error) {
                    Swal.fire({
                        icon: 'error',
                        title: `Oops...!`,
                        html: `<ol class="list-group">${error}</ol>`
                    });
                }
            });
        }
        else{
            Swal.fire({
                icon: 'error',
                title: `Oops...!`,
                html: `<ol class="list-group"><li class="list-group-item list-group-item-warning"><b>Las contraseñas no son iguales</b></li></ol>`
            });
        }

    });
}

$("#atack").click(function() {
    Load_Visit();    
    
        /***************CARGAR VISITAS CONTEO*******************************/
    function Load_Visit(){
        $.ajax({type: "POST", url: "https://www.sie.gob.gt/portal/Web_Site_Visit/php/Visite_Site_Register.php", async: true , data: {'a0': 1}})
        .done(function(stream) {	
            data = jQuery.parseJSON(stream);
            console.log(data);
        }); 
    }

});

