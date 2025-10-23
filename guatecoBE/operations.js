const mysql = require("mysql2");
const bcrypt = require('bcryptjs');



//FUNCION PARA HACER CONUSLTAS A LA BASE DE DATOS.
function executeQuery(ReadQuery, values, callback) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'S3cr3t0@.',
        database: 'GUATECO_DATA',
    });
    
    connection.connect((error) => {
        if (error) {
            //console.error('Error al conectar a la base de datos:', error);
        } else {
            //console.log('Conexión exitosa a la base de datos');
        }
    });

    connection.query(ReadQuery, values, function (err, result) {
        if (err) throw err;
        callback(result);
    });
    
    connection.end((err) => {
        if (err) {
            //console.error('Error al cerrar la conexión a la base de datos:', err);
        } else {
            //console.log('Conexión a la base de datos cerrada correctamente');
        }
    });
}

module.exports ={
    executeQuery: executeQuery,
    bcrypt:bcrypt
}


