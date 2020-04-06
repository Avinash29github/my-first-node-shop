const express = require('express');
const routes = express.Router();
const multer = require('multer');

const productController = require('../controller/product');
const checkAuth = require('../authorization/auth-jwt');

// Multer Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

// Multer Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('please upload a image either in JPEG or PNG'), false);
    }
}

// Multer
const uploads = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 6
    },
    fileFilter: fileFilter
});


routes.get('/', productController.get_all_products);

routes.post('/', checkAuth, uploads.single('productImage'), productController.create_product);

routes.get('/:pId', productController.get_single_product);

routes.patch('/:pId', checkAuth, productController.update_product);

routes.delete('/:pId', checkAuth, productController.delete_product);

module.exports = routes;