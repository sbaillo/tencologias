//Nombre, version, descripcion, tamañoEstimado, funcion que se ejecuta solo cuando se crea la base de datos
var tamanio = 1024 * 1024 * 5; //5Mb
var db = window.openDatabase("test", "1.0", "testing", tamanio, function () {
    //se ejecuta por unica vez cuando se crea la base de datos
    //Si abro BD con version no puedo cambiar a otra con misma BD

    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("CREATE TABLE if not EXISTS favoritos (email varchar(100), medico varchar(100))");

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message)

    }, function () { //funcion que se ejecuta cuando todo sale bien
        console.log("Transaccion OK");
    });

    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("CREATE TABLE if not EXISTS puntuados (email varchar(100), medico varchar(100), puntos int)");

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message)

    }, function () { //funcion que se ejecuta cuando todo sale bien
        console.log("Transaccion OK");
    });
});

function agregarFavorito(nombreMedico) {
    var email = sessionStorage.getItem("logueado");
    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("IF NOT EXISTS (Select * from favoritos where email=? AND medico=?) INSERT INTO favoritos VALUES(? , ?)", [email, nombreMedico, email, nombreMedico] );

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message);
        return false;


    }, function () { //funcion que se ejecuta cuando todo sale bien
        console.log("Transaccion OK");
        return true;
    });
}

function borrarFavorito(nombreMedico) {
    var email = sessionStorage.getItem("logueado");
    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("DELETE FROM favoritos where email=? AND medico=?", [email, nombreMedico]);

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message);
        return false;

    }, function () { //funcion que se ejecuta cuando todo sale bien
        console.log("Transaccion OK");
        return true;
    });
}

function misFavoritos() {
    var email = sessionStorage.getItem("logueado");
    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("SELECT * FROM favoritos where email=?", [email]);

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message);
        return null;

    }, function (tx, result) { //funcion que se ejecuta cuando todo sale bien
        var medicos = [];
        $.each(result.rows, function(index, value){
            medicos.push[value.medicos];
        });
        return medicos;
        console.log("Transaccion OK");
    });
}

function esFavorito(nombreMedico) {
    var email = sessionStorage.getItem("logueado");
    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("SELECT * FROM favoritos where email=? AND medico=?", [email, nombreMedico]);

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message)

    }, function (tx, result) { //funcion que se ejecuta cuando todo sale bien
        if(result.rows.length > 0) return true;
            else return false;
    });
}

function agergarPuntaje(nombreMedico, puntos) {
    var email = sessionStorage.getItem("logueado");
    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("IF NOT EXISTS (Select * from puntuados where email=? AND medico=?) INSERT INTO puntuados VALUES(?,?,?)", [email, nombreMedico, email, nombreMedico, puntos]);

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message)

    }, function () { //funcion que se ejecuta cuando todo sale bien
        console.log("Transaccion OK");
    });
}

function fuePuntuado(nombreMedico) {
    var email = sessionStorage.getItem("logueado");
    db.transaction(function (tx) { // funcion con la query
        tx.executeSql("SELECT * FROM puntuados where email=? AND medico=?", [email, nombreMedico]);

    }, function (e) { //funcion que se ejecuta cuando hay error
        console.log(e.message)

    }, function (tx, result) { //funcion que se ejecuta cuando todo sale bien
        if(result.rows.length > 0) return true;
            else return false;
    });
}