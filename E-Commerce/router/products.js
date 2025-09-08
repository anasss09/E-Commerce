const productController = require('../controller/admin')
const express = require('express')
const router = express.Router();


// GET Request
router.get('/products/all', productController.getProductAll)
router.get('/', productController.getAdminHomePage)
router.get('/products/update/:id', productController.getProductsupdate)
router.get('/products/delete/:id', productController.getProductDelete)
router.get('/products/add', productController.getProductAdd)


// POST Request
router.post('/products/add', productController.postProductAdd)
router.post('/products/update', productController.postProductUpdate)

module.exports = router;