const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const productController = require('../controllers/productController.js');
const catProductController = require('../controllers/catProductController.js');
const statesController = require('../controllers/statesController.js');
const ordenController = require('../controllers/ordenController.js');
const ROLES = require('../config/roles.js');
const { authenticateToken, authorizeRole } = require('../config/auth.js');

// ***********************************************************************
//                     ENDPOINTS MAIN
// ***********************************************************************
router.get('/products', productController.getActiveProducts);
router.post('/login', userController.loginUser);
router.post('/users/create', userController.createUser);

// ***********************************************************************
//                     ENDPOINTS AUTENTICACION 
// ***********************************************************************
router.use(authenticateToken); // Todas las rutas siguientes requieren autenticación
router.post('/logout', userController.logoutUser);
// ***********************************************************************
//                     ENDPOINTS PRODUCTOS
// ***********************************************************************
router.get('/products/getAll', authorizeRole([ROLES.ADMIN]), productController.getAllProducts);
router.post('/products/checkCode', authorizeRole([ROLES.ADMIN]), productController.checkIfCodeExists);
router.post('/products/create', authorizeRole([ROLES.ADMIN]), productController.createProduct);
router.put('/products/update/:idProductos', authorizeRole([ROLES.ADMIN]), productController.updateProduct);

// ***********************************************************************
//                     ENDPOINTS CATEGORIA PRODUCTOS
// ***********************************************************************
router.get('/CatProducts/getProductsCategory', authorizeRole([ROLES.ADMIN]), productController.getProductsbyCategory);
router.get('/CatProducts', authorizeRole([ROLES.ADMIN]), catProductController.getAllCategories);
router.post('/CatProducts/create', authorizeRole([ROLES.ADMIN]), catProductController.createCategory);
router.post('/CatProducts/checkName', authorizeRole([ROLES.ADMIN]), catProductController.checkIfNameExists);
router.put('/CatProducts/update/:idCategoriaProductos', authorizeRole([ROLES.ADMIN]), catProductController.updateCategory);

// ***********************************************************************
//                     ENDPOINTS ESTADOS
// ***********************************************************************
router.get('/states', authorizeRole([ROLES.ADMIN]), statesController.getAllStates);
router.post('/states/create', authorizeRole([ROLES.ADMIN]), statesController.createEstado);
router.put('/states/update/:idEstados', authorizeRole([ROLES.ADMIN]), statesController.updateEstado);

// ***********************************************************************
//                     ENDPOINTS USUARIOS
// ***********************************************************************
router.get('/users', authorizeRole([ROLES.ADMIN]), userController.getAllUsers);
router.put('/users/update/:idUsuarios', authorizeRole([ROLES.ADMIN]), userController.updateUser);
router.post('/users/oper/create', authorizeRole([ROLES.ADMIN]), userController.createUser);

// ***********************************************************************
//                  ENDPOINTS ORDENES/DETALLES
// ***********************************************************************
router.get('/orden', authorizeRole([ROLES.ADMIN]), ordenController.getAllOrdenes);
router.get('/orden/user/:idUsuarios', authorizeRole([ROLES.CLIENT,ROLES.ADMIN]), ordenController.getOrdenUser);
router.get('/orden/details/:idOrden', authorizeRole([ROLES.CLIENT,ROLES.ADMIN]), ordenController.getOrderDetails);
router.post('/orden/create', authorizeRole([ROLES.CLIENT]), ordenController.createOrder);
router.put('/orden/update/:idOrden', authorizeRole([ROLES.CLIENT, ROLES.ADMIN]), ordenController.updateOrder);

module.exports = router;