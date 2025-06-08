import express from 'express';
import {createOrder, getAvailableProducts, updatePaymentStatus, stormRefund,getOrdersByName, getAllOrders} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.get('/available', getAvailableProducts);
orderRouter.put('/updatePayment', updatePaymentStatus);
orderRouter.put('/stormRefund', stormRefund);
orderRouter.get('/byName', getOrdersByName);
orderRouter.get('/getallorders', getAllOrders)
export default orderRouter;

