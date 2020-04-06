const express = require('express');
const app = express();
const uuidv4 = require('uuid/v4');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./app/routes/products');
const orderRoutes = require('./app/routes/orders');
const userRoutes = require('./app/routes/user');

// Database connection
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', process.env.MONGO_DB_URL)
});
db.on('error', err => {
  console.error('connection error:', err)
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Cors

app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'GET', 'PATCH', 'DELETE', 'GET', 'POST');
        return res.status(200).json({});
    }
    next();
});

// Routes handling requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next)=> {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;