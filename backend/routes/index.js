const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const productController = require('../controllers/productController.js');
const catProductController = require('../controllers/catProductController.js');
const statesController = require('../controllers/statesController.js');
const ordenController = require('../controllers/ordenController.js');
const { authenticateToken, authorizeRole } = require('../config/auth.js');

// ***********************************************************************
//                     ENDPOINTS MAIN
// ***********************************************************************
router.get('/products', productController.getAllProducts);
router.post('/login', userController.loginUser);
router.post('/users/create', userController.createUser);

// ***********************************************************************
//                     ENDPOINTS AUTENTICACION 
// ***********************************************************************
router.use(authenticateToken); // Todas las rutas siguientes requieren autenticación

// ***********************************************************************
//                     ENDPOINTS PRODUCTOS
// ***********************************************************************
router.post('/products/create', authorizeRole([2]), productController.createProduct);
router.put('/products/update/:idProductos', authorizeRole([2]), productController.updateProduct);

// ***********************************************************************
//                     ENDPOINTS CATEGORIA PRODUCTOS
// ***********************************************************************
router.get('/CatProducts', authorizeRole([2]), catProductController.getAllCategories);
router.post('/CatProducts/create', authorizeRole([2]), catProductController.createCategory);
router.put('/CatProducts/update/:idCategoriaProductos', authorizeRole([2]), catProductController.updateCategory);

// ***********************************************************************
//                     ENDPOINTS ESTADOS
// ***********************************************************************
router.get('/states', authorizeRole([2]), statesController.getAllStates);
router.post('/states/create', authorizeRole([2]), statesController.createEstado);
router.put('/states/update/:idEstados', authorizeRole([2]), statesController.updateEstado);

// ***********************************************************************
//                     ENDPOINTS USUARIOS
// ***********************************************************************
router.get('/users', authorizeRole([2]), userController.getAllUsers);
router.put('/users/update/:idUsuarios', authorizeRole([2]), userController.updateUser);

// ***********************************************************************
//                  ENDPOINTS ORDENES/DETALLES
// ***********************************************************************
router.get('/orden', authorizeRole([2]), ordenController.getAllOrdenes);
router.get('/orden/:idUsuarios', authorizeRole([1]), ordenController.getOrdenUser);
router.post('/orden/create', authorizeRole([1]), ordenController.createOrder);
router.put('/orden/update/:idOrden', authorizeRole([2]), ordenController.updateOrder);

module.exports = router;