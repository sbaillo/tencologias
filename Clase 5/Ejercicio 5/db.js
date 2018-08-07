//Nombre, version, descripcion, tamañoEstimado, funcion que se ejecuta solo cuando se crea la base de datos
var tamanio = 1024*1024*5; //5Mb
var db = window.openDatabase("test", "1.0", "testing", tamanio, function(){
    //se ejecuta por unica vez cuando se crea la base de datos
    //Si abro BD con version no puedo cambiar a otra con misma BD
    
    db.transaction(function(tx){ // funcion con la query
        tx.executeSql("CREATE TABLE if not EXISTS test (id_dato integer(10), txt_dato varchar(100))");
    
    }, function(e){ //funcion que se ejecuta cuando hay error
        console.log(e.message)
    
    }, function(){ //funcion que se ejecuta cuando todo sale bien
        console.log("Transaccion OK");
    });

});


db.transaction(function(tx){ // funcion con la query
    tx.executeSql("INSERT INTO test VALUES('1' , 'Dato1')");

}, function(e){ //funcion que se ejecuta cuando hay error
    console.log(e.message)

}, function(){ //funcion que se ejecuta cuando todo sale bien
    console.log("Transaccion OK");
});
