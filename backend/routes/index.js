const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const catProductController = require('../controllers/catProductController');
const statesController = require('../controllers/statesController');
const { authenticateToken } = require('../config/auth');

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

module.exports = router;