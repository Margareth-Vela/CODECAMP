const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');

// ***********************************************************************
//                     ENDPOINTS PRODUCTOS
// ***********************************************************************
router.get('/products', productController.getAllProducts);
router.post('/products/create', productController.createProduct);
router.put('/products/update/:idProductos', productController.updateProduct);
// ***********************************************************************
//                     ENDPOINTS USUARIOS
// ***********************************************************************
router.get('/users/select', userController.getAllUsers);
//router.post('/', userController.createUser);

module.exports = router;