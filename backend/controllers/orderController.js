import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';


export const createOrder = async (req, res) => {
  try {
    const { client, orderItems, startTime, durationTurns, safetyProduct, paymentStatus } = req.body;

    if (!client || !orderItems || !startTime || !durationTurns) {
      return res.status(400).json({ message: 'Datos incompletos.' });
    }

    let endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationTurns * 30);


    // Validación de duración: entre 1 y 3 turnos
    if (durationTurns < 1 || durationTurns > 3) {
      return res.status(400).json({ message: 'La duración del turno debe ser entre 1 y 3 turnos.' });
    }

    // Calcular total
    let totalPrice = 0;
    let itemQuantity = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      totalPrice += product.price * item.quantity * durationTurns;
      
    }

    

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
   totalPrice += product.price * item.quantity * durationTurns;
    itemQuantity += 1; // O mejor: itemQuantity += item.quantity;
  }

  let discountApplied = false;
  const totalUnits = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  if (totalUnits > 2) {
   totalPrice *= 0.8;
   discountApplied = true;
  }

    const newOrder = new Order({
      client,
      orderItems,
      startTime,
      durationTurns,
      endTime,
      discountApplied,
      totalPrice,
      safetyProduct,
      paymentStatus
    });

    await newOrder.save();

    res.status(201).json({ message: 'Turno reservado exitosamente.', order: newOrder });

  } catch (error) {
    console.error('Error al crear el turno:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getAvailableProducts = async (req, res) => {
  try {
    const { startTime, durationTurns } = req.query;

    if (!startTime || !durationTurns) {
      return res.status(400).json({ message: 'Parámetros startTime y durationTurns requeridos.' });
    }

    const start = new Date(startTime);
    const duration = parseInt(durationTurns);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationTurns * 30);

    const allProducts = await Product.find({});

    const availableProducts = [];

    for (const product of allProducts) {
      // Buscar órdenes que solapan con el turno
      const overlappingOrders = await Order.find({
        'orderItems.product': product._id,
        startTime: { $lt: end },
        endTime: { $gt: start }
      });
      const relevantOrders = overlappingOrders.filter(order => {
        const orderEnd = new Date(order.startTime);
        orderEnd.setMinutes(orderEnd.getMinutes() + order.durationTurns * 30);
        return orderEnd > start; // hay solapamiento real
      });

      // Sumar cantidad reservada de este producto
      const reservedQuantity = relevantOrders.reduce((acc, order) => {
        const match = order.orderItems.find(i => i.product.toString() === product._id.toString());
        return acc + (match ? match.quantity : 0);
      }, 0);

      const availableQuantity = product.quantity - reservedQuantity;

      if (availableQuantity > 0) {
        availableProducts.push({
          _id: product._id,
          name: product.name,
          category: product.category,
          availableQuantity,
          price: product.price,
        });
      }
    }


    res.json(availableProducts);
  } catch (error) {
    console.error('Error al obtener productos disponibles:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { paymentStatus } = req.body;

    if (!['Pendiente', 'Pagado', 'Cancelado', 'Tormenta'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Estado de pago inválido.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada.' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ message: 'Estado de pago actualizado.', order });
  } catch (error) {
    console.error('Error al actualizar el estado de pago:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const stormRefund = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Se requieren startTime y endTime.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    const result = await Order.updateMany(
      {
        startTime: { $gte: start },
        endTime: { $lte: end }
      },
      { $set: { stormRefund: true } }
    );

    res.status(200).json({
      message: 'Órdenes actualizadas con stormRefund = true',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error al actualizar stormRefund:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getOrdersByName = async (req, res) => {
  const { name } = req.query;
  try {
    const orders = await Order.find({ 'client': name }).populate('orderItems.product');
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No se encontraron órdenes para este cliente.' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes por nombre:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
