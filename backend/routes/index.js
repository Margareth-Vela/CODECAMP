const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const productController = require('../controllers/productController.js');
const catProductController = require('../controllers/catProductController.js');
const statesController = require('../controllers/statesController.js');
const ordenController = require('../controllers/ordenController.js');
const { authenticateToken } = require('../config/auth.js');

// ***********************************************************************
//                     ENDPOINTS MAIN
// ***********************************************************************
router.get('/products', productController.getAllProducts);
router.post('/login', userController.loginUser);
router.post('/users/create', userController.createUser);

// ***********************************************************************
//                     ENDPOINTS AUTENTICACION 
// ***********************************************************************
//router.use(authenticateToken); // Todas las rutas siguientes requieren autenticación

// ***********************************************************************
//                     ENDPOINTS PRODUCTOS
// ***********************************************************************
router.post('/products/create', productController.createProduct);
router.put('/products/update/:idProductos', productController.updateProduct);

// ***********************************************************************
//                     ENDPOINTS CATEGORIA PRODUCTOS
// ***********************************************************************
router.get('/CatProducts', catProductController.getAllCategories);
router.post('/CatProducts/create', catProductController.createCategory);
router.put('/CatProducts/update/:idCategoriaProductos', catProductController.updateCategory);

// ***********************************************************************
//                     ENDPOINTS ESTADOS
// ***********************************************************************
router.get('/states', statesController.getAllStates);
router.post('/states/create', statesController.createEstado);
router.put('/states/update/:idEstados', statesController.updateEstado);

// ***********************************************************************
//                     ENDPOINTS USUARIOS
// ***********************************************************************
router.get('/users', userController.getAllUsers);
router.put('/users/update/:idUsuarios', userController.updateUser);

// ***********************************************************************
//                  ENDPOINTS ORDENES/DETALLES
// ***********************************************************************
router.get('/orden', ordenController.getAllOrdenes);
router.get('/orden/:idUsuarios', ordenController.getOrdenUser);
router.post('/orden/create', ordenController.createOrder);
router.put('/orden/update/:idOrden', ordenController.updateOrder);

module.exports = router;