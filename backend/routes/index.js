const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const catProductController = require('../controllers/catProductController');

// ***********************************************************************
//                     ENDPOINTS PRODUCTOS
// ***********************************************************************
router.get('/products', productController.getAllProducts);
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
//router.get('/products', productController.getAllProducts);
router.post('/states/create', productController.createProduct);
router.put('/states/update/:idEstados', productController.updateProduct);

// ***********************************************************************
//                     ENDPOINTS USUARIOS
// ***********************************************************************
router.get('/users/select', userController.getAllUsers);
//router.post('/', userController.createUser);

module.exports = router;