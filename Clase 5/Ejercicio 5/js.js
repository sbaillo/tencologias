$(document).ajaxStart(function () {
    $.mobile.loading('show');
});

$(document).ajaxStop(function () {
    $.mobile.loading('hide');
});


$(document).on("pageinit", function () {

    $(document).on("click", "#btn_registrar", function () {

        var nombre = $("#registro_nombre").val();
        var apellido = $("#registro_apellido").val();
        var estudiante = $("#registro_estudiante").val();
        var email = $("#registro_email").val();
        var direccion = $("#registro_direccion").val();
        var telefono = $("#registro_telefono").val();
        var password = $("#registro_password").val();

        try {

            if (nombre === "") throw "El nombre no puede ser vacio";
            if (apellido === "") throw "El apellido no puede ser vacio";
            if (estudiante === "" || isNaN(estudiante)) throw "Numero de estudiante invalido";

            /* var regexEmail = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$');
            if (!regexEmail.test(email)) throw "Email invalido"; */

            if (direccion === "") throw "La direccion no puede ser vacia";
            if (telefono === "" || isNaN(telefono)) throw "Telefono invalido";
            if (password === "") throw "La clave no puede ser vacia";

            var datos =
            {
                nombre: nombre,
                apellido: apellido,
                estudiante: estudiante,
                email: email,
                password: password,
                direccion: direccion,
                telefono: telefono
            };

            $.ajax({
                url: "http://api.marcelocaiafa.com/alumno",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "POST",
                timeout: 2000,
                //Que formato espero
                dataType: "json",
                data: JSON.stringify(datos),

                success: function (response) {
                    $.mobile.toast({
                        message: "Registro exitoso"
                    });
                    $(":mobile-pagecontainer").pagecontainer("change", "#ingresar");
                },

                error: function (request, status, txterror) {
                    if(request.status == 409){
                        $.mobile.toast({
                            message: "Usuario ya ingresado"
                        });
                    }else{
                        $.mobile.toast({
                            message: "Error: " + request.status + " " + request.responseJSON.message
                        });
                    }
                }
            });
        }
        catch (e) {
            $.mobile.toast({
                message: e
            });
        }
    });

$(document).on("click", "#btn_login", function () {

        var estudiante = $("#login_numero").val();
        var password = $("#login_password").val();

        try {

            if (estudiante === "" || isNaN(estudiante)) throw "Numero de estudiante invalido";
            if (password === "") throw "La clave no puede ser vacia";

            var datos =
            {
                estudiante: estudiante,
                password: password,
            };

            $.ajax({
                url: "http://api.marcelocaiafa.com/signin",
                //Tipo de metodo: GET, POST, PUT, DELETE
                type: "POST",
                timeout: 2000,
                //Que formato espero
                dataType: "json",
                data: JSON.stringify(datos),

                success: function (response) {
                    // tengo que pasar a string porque la session solo acepta strings
                    var alumno = JSON.stringify(response["descripcion"]);
                    sessionStorage.setItem("alumno", alumno);
                    
                    //redirecciono a la pagina listado
                    $(":mobile-pagecontainer").pagecontainer("change", "#listado");
                },

                error: function (request, status, txterror) {
                    $.mobile.toast({
                        message: request.responseJSON.descripcion
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


    $(document).on("click", ".item", function () {
        var id = this.id;
        $.ajax({
            url: "http://api.marcelocaiafa.com/alumno/" + id,
            //Tipo de metodo: GET, POST, PUT, DELETE
            type: "GET",
            timeout: 2000,
            //Que formato espero
            dataType: "json",
    
            success: function (response) {
                $("#detalle_foto").html('<img src="http://images.marcelocaiafa.com/alumno/' + response["descripcion"]["id"] + '.png" class="icono-detalles"/>')
                $("#detalle_nombre").html(response["descripcion"]["nombre"] + " " + response["descripcion"]["apellido"]);
                $("#detalle_estudiante").html("<b>Numero de estudiante: </b> " + response["descripcion"]["estudiante"]);
                $("#detalle_email").html("<b>Email: </b>" + response["descripcion"]["email"]);
                $("#detalle_direccion").html("<b>Direccion: </b>" + response["descripcion"]["direccion"]);
                $("#detalle_telefono").html("<b>Telefono: </b>" + response["descripcion"]["telefono"]);
                sessionStorage.setItem("Id_alumno", id);

                //redirecciono a la pagina detalle
                $(":mobile-pagecontainer").pagecontainer("change", "#detalle");
            },
    
            error: function (request, status, txterror) {
                $.mobile.toast({
                    message: "No se pudo cargar el alumno"
                });
            }
        });


    });

});


$(document).on("pagebeforeshow", "#listado", function () {
    var alumno = JSON.parse(sessionStorage.getItem("alumno"));
    $("#session").html("Hola " + alumno["nombre"] + " " + alumno["apellido"]);

    $.ajax({
        url: "http://api.marcelocaiafa.com/alumno",
        //Tipo de metodo: GET, POST, PUT, DELETE
        type: "GET",
        timeout: 2000,
        //Que formato espero
        dataType: "json",

        success: function (response) {
            $("#lista").html("");
            $("#lista").listview('refresh');

            $.each(response["descripcion"], function (index, value) {
                    $("#lista").append('<li><a class="item" id="' + value["id"] + '"><img src="http://images.marcelocaiafa.com/alumno/' + value["id"] + '.png" class="icono-persona"/><h2>' + value["nombre"] + ' ' + value["apellido"] + '</h2><p>Numero de estudiante: ' + value["estudiante"] + '</p></a></li>');
                    });
                    $("#lista").listview('refresh');
        },

        error: function (request, status, txterror) {
            $.mobile.toast({
                message: "No se pudo cargar alumnos"
            });
        }
    });
});


/* Navegar entre paginas
mobile_pagecontainer

Manejo de session jquery
sessionStorage 
setItem("clave","valor");
getItem("clave","valor");
removeItem("clave");
clearall(); 

localStorage >>> Persistir datos
*/