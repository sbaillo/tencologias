$(document).ajaxStart(function () {
    $.mobile.loading('show');
});

$(document).ajaxStop(function () {
    $.mobile.loading('hide');
});

$(document).on("pageinit", function () {

    $("#listaEspecialistas").hide();

    //COMIENZO DE LOGIN
    $(document).on("click", "#btn_login", function () {

        var email = $("#login_email").val();
        var password = $("#login_password").val();

        try
        {   
            if(email == "") throw "Ingrese mail";
            if(password == "") throw "Ingrese password";
        
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
                if (response.resultado_login == "true") {
                    sessionStorage.setItem("logueado", response.id_usuario);
                } 
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


    //COMIENZO DE REGISTRO
    $(document).on("click", "#btn_registro", function () {

        var nombre = $("#txt_R_nombre").val();
        var apellido = $("#txt_R_apellido").val();
        var cedula = $("#txt_R_cedula").val();
        var telefono = $("#txt_R_telefono").val();
        var email = $("#txt_R_email").val();
        var password1 = $("#txt_R_password1").val();
        var password2 = $("#txt_R_password2").val();
 
        try
        {   
            if(nombre == "") throw "Ingrese nombre";
            if(apellido == "") throw "Ingrese apellido";
            if(cedula == "" || isNaN(cedula)) throw "Documento invalido";
            if(telefono == "" || isNaN(telefono)) throw "Telefono invalido";
            if(email == "") throw "Ingrese email";
            if(password1 == "") throw "Ingrese password";
            if(password2 == "") throw "Verificque password";
            if(password1 != password2) throw "Las contraseñas no coinciden";
        
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
                nombre : nombre,
                apellido: apellido,
                documento : cedula,
                telefono : telefono
            },

            success: function (response) {
                $.mobile.toast({
                    message: "Usuario creado"
                });
                sessionStorage.setItem("logueado", response.idUsuario);
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


    //COMIENZO DE BUSQUEDA MEDICOS
    $(document).on("click", "#btn_buscarMedicos", function () {

        var especialidad = $("#especialidad").val();
        $("#listaEspecialistas").hide();
        $("#listaEspecialistas").html("").listview("refresh");

        try
        {   
            if(especialidad == "") throw "Seleccione especialidad";
        
        $.ajax({
            url: "http://medicort.tribus.com.uy/getProfesionalesPorEspecialidad",
            //Tipo de metodo: GET, POST, PUT, DELETE
            type: "GET",
            timeout: 3000,
            //Que formato espero
            dataType: "json",
            data: { especialidad: especialidad },

            success: function (response) {
                $.each(response.profesionales, function(index, value){
                    $("#listaEspecialistas").append('<li><a class="medico" id="' + value["nombre"] + "_" + value["apellido"] + '"><img src="http://medicort.tribus.com.uy/imagenes/' + value["foto"] + '.png" class="icono-persona"/><h2>' + value["nombre"] + ' ' + value["apellido"] + '</h2><p>Especialidad: ' + value["especialidad"] + '</p></a></li>');
                });

                $("#listaEspecialistas").listview("refresh");
                $("#listaEspecialistas").show();
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

});



