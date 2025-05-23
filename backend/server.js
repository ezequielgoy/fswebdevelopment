import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connected'))
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server at http://localhost:${port}`);
});
// date testing
const date = new Date();

  