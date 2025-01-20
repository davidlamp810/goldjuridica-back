const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");
const categoriaController = require('../controllers/categoriaController.js');
const usuarioController = require('../controllers/usuarioController.js');
const caracteristicaController = require('../controllers/caracteristicaController.js');
const reservaController = require('../controllers/reservaController.js');

// Rutas para productos
router.get("/productos", productoController.getAllProductos); //Query params page y pageSize
router.get('/productos/:id', productoController.getProductoById); 
router.post("/productos", productoController.createProducto);
router.put('/productos/:id', productoController.updateProducto);
router.delete('/productos/:id', productoController.deleteProducto);
router.post("/search", productoController.searchProductos);
router.get('/keywords', productoController.getDistinctKeywords);

// Rutas para categorias
router.get('/categorias', categoriaController.getAllCategorias);
router.post('/categorias', categoriaController.createCategoria);
router.put('/categorias/:id', categoriaController.updateCategoria);
router.delete('/categorias/:id', categoriaController.deleteCategoria);

// Rutas para usuarios
router.post('/register', usuarioController.crearUsuario);
router.post('/login', usuarioController.login);
router.get('/usuarios', usuarioController.obtenerUsuarios); 
router.put('/usuarios/cambiar-rol', usuarioController.cambiarRol);
router.put("/usuarios/:id", usuarioController.updateUsuario);

// Rutas para características
// Obtener todas las características
router.get('/caracteristicas', caracteristicaController.getAllCaracteristicas);
// Crear una nueva característica
router.post('/caracteristicas', caracteristicaController.createCaracteristica);
// Actualizar una característica
router.put('/caracteristicas/:id', caracteristicaController.updateCaracteristica);
// Eliminar una característica
router.delete('/caracteristicas/:id', caracteristicaController.deleteCaracteristica);


//Rutas para favoritos
router.post("/favoritos", usuarioController.toggleFavorito);
router.get("/favoritos/:rolId", usuarioController.obtenerFavoritos);

// Ruta para obtener el detalle de reserva temporal
router.post('/detalle', reservaController.obtenerDetalleReserva);

// Ruta para reservas
router.post('/confirmar', reservaController.confirmarReserva);
router.post('/fechasDisponibles', reservaController.obtenerFechasDisponibles);
router.get('/historial/:usuarioId', reservaController.obtenerHistorialReservas);
router.get('/fechasReservadas/:productoId', reservaController.obtenerFechasReservadas);

module.exports = router;
