const express = require('express');

const { createItem,
    getAllItems,
    getItemsByid,
    getItemHistory,
    deleteItem, } = require('../controllers/productController.js');
const userAuth = require('../middlewares/userAuth');


const itemRouter = express.Router();

itemRouter.post('/create-item', userAuth, createItem);
itemRouter.get('/get-items', userAuth, getAllItems);
itemRouter.get('/get-item/:id', userAuth, getItemsByid);
itemRouter.put('/history', userAuth, getItemHistory);
itemRouter.delete('/delete-item/:id', userAuth, deleteItem);

module.exports = itemRouter;