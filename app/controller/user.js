const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.sign_up_users = (req, res, next) => {
    User.find({ userEmail: req.body.userEmail }).exec()
        .then(userDoc => {
            if (userDoc < 1) {
                bcrypt.hash(req.body.userPassword, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).json({
                            error: error
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            userEmail: req.body.userEmail,
                            userPassword: hash
                        });
                        console.log(user);
                        user.save()
                            .then(result => {

                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            } else {
                res.status(409).json({
                    error: 'Email Exists'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.user_login = (req, res, next) => {
    User.find({ userEmail: req.body.userEmail }).exec()
        .then(user => {
            if (user < 1) {
                return res.status(401).json({
                    error: 'Authorization Failed'
                });
            }
            bcrypt.compare(req.body.userPassword, user[0].userPassword, (err, hashSame) => {
                if (err) {
                    res.status(401).json({
                        error: 'Authorization Failed'
                    });
                }
                if (hashSame) {
                   const token = jwt.sign({
                        userEmail: user[0].userEmail,
                        _id: user[0]._id
                    }, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
                    return res.status(200).json({
                        message: 'Authorization Successfull',
                        token: token
                    });
                }
                res.status(401).json({
                    error: 'Authorization Failed'
                });
            });
        })
        .catch(err => {
            return res.status(401).json({
                error: 'Authorization Failed'
            });
        });
}

exports.get_all_users = (req, res, next) => {
    User.find().select('_id userEmail').exec()
        .then(result => {
            res.status(200).json({
                userDetails: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId }).exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted Successfully',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}