const mongoose = require('mongoose');
const Product = require('../model/product');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Product Listed',
                count: result.length,
                products: result.map((data) => {
                    return {
                        name: data.name,
                        price: data.price,
                        _id: data._id,
                        productImage: data.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + data._id
                        },
                    }
                })
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}

exports.create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then((result) => {
        res.status(201).json({
            message: 'Product Created Successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.get_single_product = (req, res, next) => {
    const id = req.params.pId;
    Product.findById(id)
        .select('name price productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    message: `${id} retreived`,
                    product: doc
                });
            } else {
                res.status(404).json({ error: { message: "Doc Not Found" } });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_product = (req, res, next) => {
    const id = req.params.pId;
    console.log(req.body);

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Product updated successfully',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err });
        })
}

exports.delete_product = (req, res, next) => {
    const id = req.params.pId;
    Product.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Product Deleted Successfully'
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: err });
        });
}