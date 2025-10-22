const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path'); 
const app = express();

 //CREAMOS LA SESION
 app.use(session({
    secret: "987f4bd6d4315c20b2ec70a46ae846d19d0ce563450c02c5b1bc71d5d580060b",
    saveUninitialized: true,
    resave: true,
  }));

  
  const PORT = 3000; // PUERTO DEFINIDO
  
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true,  limit: '20mb'}));
app.use(express.static('public'));

//ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname, '../guatecoFE/src'))); // Archivos html del proyecto incluyendo el index.html
app.use('/js',express.static(path.join(__dirname, '../guatecoFE/js'))); // Carpeta donde estan los js del proyecto
app.use('/css',express.static(path.join(__dirname, '../guatecoFE/css'))); // Carpeta donde estarán css del proyecto
app.use('/plugins',express.static(path.join(__dirname, '../guatecoFE/plugins'))); // Carpeta donde estarán las librerias extras para el proyecto
app.use('/img',express.static(path.join(__dirname, '../guatecoFE/img'))); // Carpeta donde estarán las imagenes 

//RUTAS DE ARCHIVOS BACK END
const sessionManager = require('./bk_node_modules/sesssionManager');
const bk_mision = require('./bk_node_modules/bk_mision');
const bk_vision = require('./bk_node_modules/bk_vision');
const bk_login = require('./bk_node_modules/bk_login');
const load_menu = require('./bk_node_modules/load_menu');
const bk_registrarUser = require('./bk_node_modules/bk_registrarUser');
const bk_artConsignados = require('./bk_node_modules/bk_artConsignados');
const bk_artEmpenos = require('./bk_node_modules/bk_artEmpenos');
const bk_compras = require('./bk_node_modules/bk_compras');
const bk_dashboard = require('./bk_node_modules/bk_dashboard');
const bk_empeno = require('./bk_node_modules/bk_empeno');
const bk_estadoCuenta = require('./bk_node_modules/bk_estadoCuenta');
const bk_metricas = require('./bk_node_modules/bk_metricas');
const bk_misArticulos = require('./bk_node_modules/bk_misArticulos');
const bk_peticiones = require('./bk_node_modules/bk_peticiones');
const bk_usuarios = require('./bk_node_modules/bk_usuarios');
const bk_configurarCuenta = require('./bk_node_modules/bk_configurarCuenta');
app.use('/bk_mision', bk_mision);
app.use('/bk_vision', bk_vision);
app.use('/bk_login', bk_login);
app.use('/load_menu', load_menu);
app.use('/bk_registrarUser', bk_registrarUser);
app.use('/sessionManager', sessionManager.router);
app.use('/bk_artConsignados', bk_artConsignados);
app.use('/bk_artEmpenos', bk_artEmpenos);
app.use('/bk_compras', bk_compras);
app.use('/bk_dashboard', bk_dashboard);
app.use('/bk_empeno', bk_empeno);
app.use('/bk_estadoCuenta', bk_estadoCuenta);
app.use('/bk_metricas', bk_metricas);
app.use('/bk_misArticulos', bk_misArticulos);
app.use('/bk_peticiones', bk_peticiones);
app.use('/bk_usuarios', bk_usuarios);
app.use('/bk_configurarCuenta', bk_configurarCuenta);
/****************************/

app.listen(PORT, () => {    
    //MENSAJE DE SERVIDOR
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

function generateUniqueClientId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
  console.log(' The error was: ', error );
});