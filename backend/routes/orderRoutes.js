import express from 'express';
import {createOrder, getAvailableProducts, updatePaymentStatus, stormRefund} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.get('/available', getAvailableProducts);
orderRouter.put('/updatePayment', updatePaymentStatus);
orderRouter.put('/stormRefund', stormRefund);
export default orderRouter;
