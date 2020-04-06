const express = require('express');
const routes = express.Router();

const checkAuth = require('../authorization/auth-jwt');
const orderController = require('../controller/order');


routes.get('/', checkAuth, orderController.get_all_orders);

routes.post('/', checkAuth, orderController.create_order);

routes.get('/:oId', checkAuth, orderController.get_single_order);

routes.patch('/:oId', checkAuth, orderController.update_order);

routes.delete('/:oId', checkAuth, orderController.delete_order);

module.exports = routes;