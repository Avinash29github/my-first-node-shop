const express = require('express');
const routes = express.Router();

const checkAuth = require('../authorization/auth-jwt');
const controller = require('../controller/user');


routes.post('/signup', controller.sign_up_users);

routes.post('/login', controller.user_login);

routes.get('/', controller.get_all_users);

routes.delete('/:userId', checkAuth, controller.user_delete);

module.exports = routes;