import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

// Get all
productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});
//get 1 prod by name
productRouter.get('/:name', async(req,res) =>{
  const product = await Product.findOne({name : req.params.name});
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});
//add prod
productRouter.post('/', async (req, res) => {

  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  })
  if (newProduct.name == 'surf'){
    newProduct.category =  req.body.category
  }
  const product = await newProduct.save();
  res.status(200).send({message: 'New product created'});
});

export default productRouter;
