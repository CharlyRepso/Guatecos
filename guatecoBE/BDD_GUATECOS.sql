-- Active: 1690073496023@@127.0.0.1@3306@guateco_data
CREATE DATABASE GUATECO_DATA;
DROP DATABASE GUATECO_DATA;

CREATE TABLE articulo (
  idArticulo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  valor decimal(18,2) DEFAULT NULL,
  cuotas INT DEFAULT NULL,
  fkCuota INT DEFAULT NULL,
  ponderacion INT DEFAULT NULL,
  fkTipoArticulo INT DEFAULT NULL,
  fkEstadoArticulo INT DEFAULT NULL
);


CREATE TABLE AsignarPermiso (
  idAsignarPermiso int AUTO_INCREMENT NOT NULL,
  fkTipoUsuario int NOT NULL,
  fkMenu int NULL,
  estado int DEFAULT 1,
  PRIMARY KEY (idAsignarPermiso)
);

CREATE TABLE Menu (
  idMenu int AUTO_INCREMENT NOT NULL,
  descripcion varchar(75) NOT NULL,
  nombre varchar(100) NOT NULL,
  estado int DEFAULT 1 NOT NULL,
  PRIMARY KEY (idMenu)
);

CREATE TABLE Pagina (
  idPagina int AUTO_INCREMENT NOT NULL,
  fkMenu int NULL,
  descripcion varchar(75) NULL,
  path varchar(75) NULL,
  icono varchar(25) NULL,
  estado int DEFAULT 1 NULL,
  PRIMARY KEY (idPagina)
);

CREATE TABLE Usuario (
  idUser int AUTO_INCREMENT NOT NULL,
  userName varchar(100) NULL,
  passwordHash VARCHAR(200) NULL,
  nombre varchar(255) NOT NULL,
  apellido varchar(225) NOT NULL,
  correo varchar(255) NULL,
  telefono varchar(25) NULL,
  direccion varchar(255) NULL,
  estado int DEFAULT 1 NOT NULL,
  fkTipoUsuario int NULL,
  PRIMARY KEY (idUser)
);


CREATE TABLE TipoUsuario (
  idTipoUsuario int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  nombre varchar(100) NULL
);

CREATE TABLE Cuota (
  idCuotas INT PRIMARY KEY AUTO_INCREMENT,
  meses int NOT NULL,
  rangoMin int NOT NULL,
  interes decimal(10,2) NOT NULL,
  estado int DEFAULT 1
);

CREATE TABLE empeno(
  idEmpeno INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200),
  descripcion VARCHAR(400),
  fechaIngreso TIMESTAMP,
  cuotasVencidas INT DEFAULT 0,
  fkestadoEmpeno INT,
  fkArticulo INT,
  fkUsuario INT,
  fkcuota INT,
  cuotas INT,
  valorEmpeo DECIMAL(18,2)
);


CREATE TABLE Estado (
  idEstado INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombre varchar(255) NULL,
  descripcion varchar(255) NULL
);

CREATE TABLE EstadoPago (
  idEstadoPago INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  descripcion varchar(25) NULL
);

CREATE TABLE Imagen (
  idImagen INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  Imagen MEDIUMTEXT NULL,
  idArticulo int NULL,
  estado int DEFAULT 1 NULL
);


CREATE TABLE Pago (
  idPago INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  fkEmpeno int NULL,
  fkEstadoPago int NULL,
  comentario VARCHAR(300) NULL,
  fechaVencimiento date NULL,
  fechaPago date NULL,
  numeroDocumento varchar(75) NULL,
  fkTipoPago int NULL
);

CREATE TABLE TipoArticulo (
  idTipoArticulo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  descripcion varchar(255) NOT NULL,
  estado int DEFAULT 1 NOT NULL
);

CREATE TABLE TipoPago (
  idTipoPago INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  descripcion varchar(150) NULL
);

CREATE TABLE venta (
  idVenta INT PRIMARY KEY AUTO_INCREMENT,
  fkArticulo INT,
  titulo VARCHAR (150),
  descripcion VARCHAR(250),
  fechaPublicacion DATETIME,
  precio DECIMAL(18,2),
  estado INT
);
CREATE TABLE pago_venta(
  idPago INT PRIMARY KEY AUTO_INCREMENT,
  fkCompra INT,
  fkTipoPago INT,
  banco VARCHAR(25),
  numeroDocumento VARCHAR(75),
  ValorPagado DECIMAL(18,2),
  estado INT
); 

CREATE TABLE compra(
  idCompra INT PRIMARY KEY AUTO_INCREMENT,
  fkUsuario INT,
  fkVenta INT,
  fechaCompra DATETIME,
  nit VARCHAR(25),
  direccion VARCHAR(200),
  comentario VARCHAR(300),
  estado INT
);

ALTER TABLE pago_venta ADD CONSTRAINT FKTPPAVE FOREIGN KEY (fkTipoPago) REFERENCES TipoPago (idTipoPago);
ALTER TABLE pago_venta ADD CONSTRAINT FKCOPAVE FOREIGN KEY (fkCompra) REFERENCES compra (idCompra);

ALTER TABLE venta ADD CONSTRAINT FKARTVEN FOREIGN KEY (fkArticulo) REFERENCES articulo (idArticulo);
ALTER TABLE venta ADD CONSTRAINT FKARTEST FOREIGN KEY (estado) REFERENCES Estado (idEstado);

ALTER TABLE compra ADD CONSTRAINT FKCOMUSER FOREIGN KEY (fkUsuario) REFERENCES usuario (idUser);
ALTER TABLE compra ADD CONSTRAINT FKCOMSALE FOREIGN KEY (fkVenta) REFERENCES venta (idVenta);
ALTER TABLE compra ADD CONSTRAINT FKCOMTPAG FOREIGN KEY (fkTipoPago) REFERENCES tipopago (idTipoPago);

ALTER TABLE Articulo ADD CONSTRAINT FK_EST_ART FOREIGN KEY (fkEstadoArticulo) REFERENCES estado (idEstado);
ALTER TABLE Articulo ADD CONSTRAINT FK_CUT_ART FOREIGN KEY (fkCuota) REFERENCES Cuota (idCuotas);
ALTER TABLE Articulo ADD CONSTRAINT FK_TAR_ART FOREIGN KEY (fkTipoArticulo) REFERENCES TipoArticulo (idTipoArticulo);

ALTER TABLE Empeno ADD CONSTRAINT FK_EMP_ART FOREIGN KEY (fkArticulo) REFERENCES Articulo (idArticulo);
ALTER TABLE Imagen ADD CONSTRAINT FK_IMG_ART FOREIGN KEY (idArticulo) REFERENCES Articulo (idArticulo);
ALTER TABLE Pagina ADD CONSTRAINT FK_PAG_MEN FOREIGN KEY (fkMenu) REFERENCES Menu (idMenu);
ALTER TABLE Pago ADD CONSTRAINT FK_PAG_EMP FOREIGN KEY (fkEmpeno) REFERENCES Empeno (idEmpeno);
ALTER TABLE Pago ADD CONSTRAINT FK_PAG_ESP FOREIGN KEY (fkEstadoPago) REFERENCES estado (idEstado);
ALTER TABLE Pago ADD CONSTRAINT FK_PAG_TPA FOREIGN KEY (fkTipoPago) REFERENCES TipoPago (idTipoPago);


ALTER TABLE usuario ADD INDEX idx_userName (userName);
ALTER TABLE usuario ADD CONSTRAINT FK_EMP_TUS FOREIGN KEY (fkTipoUsuario) REFERENCES TipoUsuario(idTipoUsuario);
ALTER TABLE asignarPermiso ADD CONSTRAINT FK_PER_TUS FOREIGN KEY (fkTipoUsuario) REFERENCES TipoUsuario(idTipoUsuario);
ALTER TABLE asignarPermiso ADD CONSTRAINT FK_PER_MENU FOREIGN KEY (fkMenu) REFERENCES menu (idMenu);
ALTER TABLE pagina ADD CONSTRAINT FK_PAG_MENU FOREIGN KEY (fkMenu) REFERENCES menu (idMenu);

INSERT INTO TipoArticulo (descripcion) 
VALUES 
('Autos'),
('Motos'),
('Celulares'),
('Relojes'),
('Diamantes'),
('Inmuebles'),
('Electronicos'),
('Herramientas'),
('Accesorios y articulos personales'),
('Articulos de piel'),
('Pantallas'),
('Tabletas'),
('Consolas de videojuegos');


INSERT INTO TipoPago (descripcion)
VALUES
('Deposito'),
('Transferencia'),
('Ninguno');

INSERT INTO tipopago (descripcion)
VALUES
('Ninguno');

INSERT INTO TipoUsuario (nombre)
VALUES
('FREE_USER'),
('NORMAL_USER'),
('ADMIN_USER');

INSERT INTO Menu (idMenu,NOMBRE, DESCRIPCION) VALUES
(1, "FREE","Menu, abierto al publico. sin logeo"),
(2, "USER","Menu, usuarios normales, con logeo"),
(3, "ADMIN","Menu, administradores del sitio, con logueo");

INSERT INTO AsignarPermiso (fkTipoUsuario, fkMenu, estado)
VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1);

-- INSERTS PAGINAS DE NIVEL 1 FREE
INSERT INTO Pagina (`fkMenu`, descripcion, path, icono)
VALUES
(1, 'Login', 'login.html', 'bx bx-log-in' ),
(1, 'Registrarse', 'registro.html', 'bx bxs-user-plus');

-- INSERTS PAGINAS DE NIVEL 2 USER
INSERT INTO Pagina (`fkMenu`, descripcion, path, icono)
VALUES
(2, 'Empeños', 'empeno.html', 'bx bx-dollar-circle'),
(2, 'Compras', 'compras.html', 'bx bxs-shopping-bags' ),
(2, 'Estado de Cuenta', 'estadoCuenta.html', 'bx bx-line-chart' ),
(2, 'Mis Articulos', 'misArticulos.html', 'bx bxs-devices');

-- INSERTS PAGINAS DE NIVEL 3 ADMIN

INSERT INTO Pagina (`fkMenu`, descripcion, path, icono)
VALUES
(3, 'Peticiones', 'peticiones.html', 'bx bxs-inbox'),
(3, 'Art. Empeñados', 'artEmpenos.html', 'bx bxs-shopping-bags' ),
(3, 'Art. Consignados', 'artConsignados.html', 'bx bxs-face-mask' ),
(3, 'Metricas', 'metricas.html', 'bx bx-chart'),
(3, 'Registrar', 'registrar.html', 'bx bxs-user-plus');

INSERT INTO Pagina (`fkMenu`, descripcion, path, icono, estado)
VALUES
(1, 'GUATECOS', 'dashboard.html', 'bx bx-money',2),
(2, 'GUATECOS', 'dashboard.html', 'bx bx-money',2),
(3, 'GUATECOS', 'dashboard.html', 'bx bx-money',2);

INSERT INTO Pagina (`fkMenu`, descripcion, path, icono, estado)
VALUES
(2, 'Configurar Cuenta', 'configurarCuenta.html', 'bx bxs-cog',2),
(3, 'Configurar Cuenta', 'configurarCuenta.html', 'bx bxs-cog',2);


INSERT INTO Estado (idEstado, nombre, descripcion) VALUES
(1, 'Postulado', 'Empeño pendiente de aprobación o negocionación'),
(2, 'Negociación', 'Empeño, en estado de aceptación por parte del usuario'),
(3, 'Aceptado', 'Negociacion por empeño aceptado por ambas partes'),
(4, 'Consignado', 'Artículo, tomado por parte de GUATECOS como suyo'),
(5, 'Venta', 'Artículo, puesto en venta por parte de GUATECOS'),
(6, 'Cancelado', 'Empeño, con sus pagos completados'),
(7, 'Devuelto', 'Artículo, reclamado por el usuario y devuleto al mismo'),
(8, 'Vendido', 'Artículo, vendido pre consignado'),
(9, 'Rechazado', 'Solicutud de empeño sin aprovacion de la admistración'),
(10, 'Creado', 'Articulo creado, y vinculado a un empeño'),
(11, 'Publicado', 'Venta publicada, en el portal web'),
(12, 'Finalizado', 'Venta finalizada, cuando se da por vendido el articulo'),
(13, 'Eliminado', 'Venta Eliminada, cuando se da de baja la venta.'),
(14, 'Reservado', 'Venta, en reserva por solicitud entrante'),
(15, 'Solcitado', 'Compra, solcitada y pendiente de verificacion de datos'),
(16, 'Aprovado', 'Compra, Aprovada, datos verificado de Manera Satisfactoria'),
(17, 'Rechazado', 'Solcitud de Compra rechazada por datos incorrectos o incoherentes'),
(18, 'Pendiente', 'Cuota, pendiente de pago'),
(19, 'Pagada', 'Cuota, Cuota Pagada a Tiempo'),
(20, 'Vencida', 'Cuota, no Pagada o con pago atrazado'),
(21, 'Reemboloso', 'Pago devuelto, a peticion del cliente'),
(22, 'Autorizado', 'Pago auotrizado y aprobado.'),
(23, 'No autorizado', 'Pago no autorizado, o invalidado por datos falsos.'),
(24, 'Verficado', 'Pago en periodo de verificación');

INSERT INTO Cuota (meses, rangoMin, interes, estado) 
VALUES
(10, 500, 0.05, 1),
(12, 3000, 0.06, 1),
(24, 5000, 0.08, 1);

select * from pago;

DROP PROCEDURE IF EXISTS InsertarConIntervalo;
DELIMITER $$
CREATE PROCEDURE InsertarConIntervalo(IN p_fkEmpeno INT, IN p_limite INT)
BEGIN
  DECLARE i INT;
  SET i = 0;
  WHILE i < p_limite DO
    INSERT INTO pago (fkEmpeno, fkEstadoPago, fechaVencimiento, fkTipoPago) 
    VALUES (p_fkEmpeno, 18, DATE_ADD(NOW(), INTERVAL i MONTH), 3);
    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;

CALL InsertarConIntervalo(1, 12);

SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE articulo;
TRUNCATE TABLE empeno;
TRUNCATE TABLE compra;
TRUNCATE TABLE pago;
TRUNCATE TABLE venta;
TRUNCATE TABLE pago_venta;
TRUNCATE TABLE imagen;
SET FOREIGN_KEY_CHECKS=1;


 UPDATE pago SET fkEstadoPago = 20 WHERE DATE(NOW()) > fechaVencimiento AND fkEstadoPago NOT IN(19, 20);

 SELECT * from pago;