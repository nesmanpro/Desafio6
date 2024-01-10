const express = require('express');
const router = express.Router();

// const CartManager = require('../controllers/CartManager');
const prodManager = new ProductManager('src/models/carts.json');