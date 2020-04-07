const jwt = require('jsonwebtoken');
const userModel = require('../model/user');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const _id = decoded._id
        const user = await userModel.findOne({ _id });
        if (!!user) {
            req.id = user._id;
            next();
        } else {
            throw "Invalid User";
        }
    } catch (error) {
        console.log(error);        
        return res.status(401).json({
            error: 'Authorization Failed'
        });
    }
}