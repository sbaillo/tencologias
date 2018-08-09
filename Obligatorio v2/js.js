$(document).ajaxStart(function () {
    $.mobile.loading('show');
});

$(document).ajaxStop(function () {
    $.mobile.loading('hide');
});

$(document).on("pageinit", "#login" ,function () {
    //COMIENZO DE LOGIN
    $("#btn_login").click( function () {
        var email = $("#login_email").val();
        var password = $("#login_password").val();
        try {
            if (email == "") throw "Ingrese mail";
            if (password == "") throw "Ingrese password";
            $.ajax({
                url: "http://medicort.tribus.com.uy/login",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "GET",
                timeout: 3000,
                //Que formato espero
                dataType: "json",
                data:
                {
                    email: email,
                    password: password,
                },
                success: function (response) {
                    sessionStorage.setItem("logueado", email);
                    $(":mobile-pagecontainer").pagecontainer("change", "#home");
                },
                error: function (xmlrequest, status, txterror) {
                    $.mobile.toast({
                        message: "Credenciales invalidas"
                    });
                }
            });
        }
        catch (e) {
            $.mobile.toast({
                message: e
            });
        }
    });
    //FIN DE LOGIN
});
    

$("#registro").on("pageinit", "#registro" ,function () {
    //COMIENZO DE REGISTRO
    $("#btn_registro").click(function () {
        var nombre = $("#txt_R_nombre").val();
        var apellido = $("#txt_R_apellido").val();
        var cedula = $("#txt_R_cedula").val();
        var telefono = $("#txt_R_telefono").val();
        var email = $("#txt_R_email").val();
        var password1 = $("#txt_R_password1").val();
        var password2 = $("#txt_R_password2").val();
        
        try {
            if (nombre == "") throw "Ingrese nombre";
            if (apellido == "") throw "Ingrese apellido";
            if (cedula == "" || isNaN(cedula)) throw "Documento invalido";
            if (telefono == "" || isNaN(telefono)) throw "Telefono invalido";
            if (email == "") throw "Ingrese email";
            if (password1 == "") throw "Ingrese password";
            if (password2 == "") throw "Verificque password";
            if (password1 != password2) throw "Las contraseñas no coinciden";
            
            $.ajax({
                url: "http://medicort.tribus.com.uy/registrar",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "POST",
                timeout: 3000,
                //Que formato espero
                dataType: "json",
                data:
                {
                    email: email,
                    password: password1,
                    nombre: nombre,
                    apellido: apellido,
                    documento: cedula,
                    telefono: telefono
                },
                success: function (response) {
                    $.mobile.toast({
                        message: "Usuario creado"
                    });
                    sessionStorage.setItem("logueado", email);
                    $(":mobile-pagecontainer").pagecontainer("change", "#home");
                },
                error: function (response) {
                    $.mobile.toast({
                        message: response.responseJSON.mensaje
                    });
                }
            });
        }
        catch (e) {
            $.mobile.toast({
                message: e
            });
        }
    });
    //FIN DE REGISTRO
});


$(document).on("pageinit", "#medicos" ,function () {
    //COMIENZO DE BUSQUEDA MEDICOS
    $("#btn_buscarMedicos").click(function () {
        var especialidad = $("#especialidad").val();
        $("#listaEspecialistas").empty();
        try {
            if (especialidad == "null" ) throw "Seleccione especialidad";
            $.ajax({
                url: "http://medicort.tribus.com.uy/getProfesionalesPorEspecialidad",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "GET",
                timeout: 3000,
                //Que formato espero
                dataType: "json",
                data: { especialidad: especialidad },
                success: function (response) {
                    $.each(response.profesionales, function (index, value) {
                        $("#listaEspecialistas").append('<li><a class="item" id="' + value["nombre"] + "_" + value["apellido"] + '"><img src = "http://medicort.tribus.com.uy/imagenes/' + value["foto"] + '.jpg" class= "icono-persona" /> <h2>' + value["nombre"] + ' ' + value["apellido"] + '</h2> <p>Especialidad: ' + value["especialidad"] + '</p></a ></li > ');
                    });
                    $("#listaEspecialistas").listview("refresh");
                },
                error: function (response) {
                    $.mobile.toast({
                        message: response.responseJSON.mensaje
                    });
                }
            });
        }
        catch (e) {
            $.mobile.toast({
                message: e
            });
        }
    });
    //FIN DE BUSQUEDA MEDICOS


    $(document).on("click", ".item", function () {
        var nombreMedico = this.id;
        var data = { nombre: nombreMedico.split('_')[0], apellido: nombreMedico.split('_')[1] };
        try {
            $.ajax({
                url: "http://medicort.tribus.com.uy/getDetalleProfesional",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "GET",
                timeout: 3000,
                //Que formato espero
                dataType: "json",
                data: data,
                success: function (response) {
                    var medico = JSON.stringify(response.profesional);
                    sessionStorage.setItem("medico", medico);
                    $(":mobile-pagecontainer").pagecontainer("change", "#detalle-medico");
                },
                error: function (response) {
                    $.mobile.toast({
                        message: response.responseJSON.mensaje
                    });
                }
            });
        }
        catch (e) {
            $.mobile.toast({
                message: e
            });
        }
    });
    //FIN DE detalle medico
});



$(document).on("pageinit", "#agendar", function () { 
    //COMIENZO DE AGENDAR CONSULTA
    $("#btn_agendar").click( function () {

        var fecha = $("#txt_C_fecha").val();
        var hora = $("#slc_C_hora").val();

        var medico = sessionStorage.getItem("medico");
        var medico = JSON.parse(medico);

        var email = sessionStorage.getItem("logueado");

        try {
            if (fecha == "") throw "Seleccione fecha";
            if (hora == "") throw "Seleccione hora";

            fecha = fecha.split('-')[2].toString() + "/" + fecha.split('-')[1].toString() + "/" + fecha.split('-')[0].toString()

            var data = {
                email: email,
                fechaHora: fecha + ' ' + hora,
                nombreProfesional: medico.nombre,
                apellidoProfesional: medico.apellido,
                nombreCentroMedico: medico.centroMedico.nombre
            };
            $.ajax({
                url: "http://medicort.tribus.com.uy/fijarConsultaMedica",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "POST",
                timeout: 3000,
                //Que formato espero
                dataType: "json",
                data: data,
                success: function (response) {
                    $(":mobile-pagecontainer").pagecontainer("change", "#medicos");
                    $.mobile.toast({
                        message: "Consulta agendada con " + medico.nombre + ' ' + medico.apellido,
                    });
                },
                error: function (response) {
                    $.mobile.toast({
                        message: response.responseJSON.mensaje
                    });
                }
            });
        }
        catch (e) {
            $.mobile.toast({
                message: e
            });
        }
    });
    //FIN DE AGENDAR CONSULTA
});


//CARGA DETALLE
$(document).on("pagebeforeshow", "#detalle-medico", function () {
    var medico = sessionStorage.getItem("medico");
    var medico = JSON.parse(medico);
    var imagen = '<img src="http://medicort.tribus.com.uy/imagenes/' + medico.foto + '.png"/>'
    var nombre = medico.nombre + ' ' + medico.apellido;
    var titulo = '<b>Titulo: </b>' + medico.titulo;
    var especialidad = '<b>Especialidad: </b>' + medico.especialidad;
    var centro = '<b>Mutualista: </b>' + medico.centroMedico.nombre;
    var puntuacion = '<b>Puntuacion: </b>' + parseFloat(medico.puntuacion).toFixed(2);
    $("#foto").html(imagen);
    $("#nombre").html(nombre);
    $("#titulo").html(titulo);
    $("#especialidad").html(especialidad);
    $("#centro").html(centro);
    $("#puntuacion").html(puntuacion);

});
//FIN DE CARGA DETALLE


//COMIENZO DE CARGA AGENDAR
$(document).on("pagebeforeshow", "#agendar", function () {
    var medico = sessionStorage.getItem("medico");
    var medico = JSON.parse(medico);
    $("#txt_C_medico").html("<b>Medico: </b>" + medico.nombre + ' ' + medico.apellido);
    $("#txt_C_especialidad").html("<b>Especialidad: </b>" + medico.especialidad);
    $("#txt_C_mutualista").html("<b>Mutualista: </b>" + medico.centroMedico.nombre);
});
//FIN DE CARGA AGENDAR


//COMIENZO DE CARGA Policlinicas
$(document).on("pagebeforeshow", "#policlinicas", function () {
    $("#listaPoliclinicas").empty();
    try {
        $.ajax({
            url: "http://medicort.tribus.com.uy/getCentrosMedicos",
            //Tipo de metodo: GET, POST, PUT, DELETE
            type: "GET",
            timeout: 3000,
            //Que formato espero
            dataType: "json",
            success: function (response) {
                $.each(response.centrosMedicos, function (index, value) {
                    $("#listaPoliclinicas").append('<li><a><h2>' + value.nombre + '</h2><p>' + value.direccion + '</p></a></li>')
                    $("#listaPoliclinicas").listview("refresh");
                });
                
            },
            error: function (response) {
                $.mobile.toast({
                    message: response.responseJSON.mensaje
                });
            }
        });
    }
    catch (e) {
        $.mobile.toast({
            message: e
        });
    }

});
//FIN DE CARGA Policlinicas


//COMIENZO DE CARGA Policlinicas
$(document).on("pagebeforeshow", "#consultas", function () {

    $("#listaConsultas").empty();
    var email = sessionStorage.getItem("logueado");

    try {
        $.ajax({
            url: "http://medicort.tribus.com.uy/getHistorialConsultasMedicas",
            //Tipo de metodo: GET, POST, PUT, DELETE
            type: "GET",
            timeout: 3000,
            //Que formato espero
            dataType: "json",
            data: { email: email },
            success: function (response) {
                $.each(response.consultasMedicas, function (index, value) {
                    $("#listaConsultas").append('<li><h2>Dr/a ' + value.profesional.nombre + ' ' + value.profesional.apellido + '</h2><p>' + value.profesional.especialidad + '</p><p>' + value.fechaHora + '</p><p>' + value.centroMedico.nombre + '</p></li>');
                    $("#listaConsultas").listview("refresh");
                    });
            
            },
            error: function (response) {
                $.mobile.toast({
                    message: response.responseJSON.mensaje
                });
            }
        });
    }
    catch (e) {
        $.mobile.toast({
            message: e
        });
    }

});
   //FIN DE CARGA Policlinicas