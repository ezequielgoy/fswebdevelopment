import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/main.css';
import '../styles/userInfoPage.css';
import Backbtn from '../components/Backbtn.jsx'

type Order = {
  _id: string;
  totalPrice: number;
  startTime: string;
  paymentStatus: 'Pendiente' | 'Pagado' | 'Cancelado';
  stormRefund?: boolean;
};

const UserInfoPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [orders, setOrders] = useState<Order[]>([]);

  // Función para obtener las órdenes del cliente
  const fetchClientOrders = async () => {
    try {

      const res = await axios.get('http://localhost:5000/api/orders/byName', {
        params: { name },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error al obtener órdenes del cliente:', err);
    }
  };
    // useEffect para obtener las órdenes y cancelar automáticamente las que correspondan
  useEffect(() => {
      fetchClientOrders();
  }, [name]);

  useEffect(() => {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Cancelar automáticamente las órdenes pendientes con menos de 2 horas de anticipación
      orders.forEach((order) => {
        const orderStartTime = new Date(order.startTime);
        if (
              
          order.paymentStatus === 'Pendiente' &&
          orderStartTime > twoHoursLater 
        ) {
          cancelOrder(order._id);
        }
      });
  }, [orders]);

  // Función para cancelar una orden
  const cancelOrder = async (orderId: string) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/updatePayment?id=${orderId}`, {
        paymentStatus: 'Cancelado',
      });
      if (res.status === 200) {
        console.log(`Orden ${orderId} cancelada automáticamente.`);
      }
    } catch (err) {
      console.error(`Error al cancelar la orden ${orderId}:`, err);
    }
  };


  // Función para manejar el pago de una orden
  const handlePay = (orderId: string) => async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/updatePayment?id=${orderId}`, {
        paymentStatus: 'Pagado',
      });
      if (res.status === 200) {
        alert('Pago realizado correctamente');
        fetchClientOrders();
      } else {
        alert(`Error al procesar el pago: ${res.data.message || 'Error desconocido del servidor.'}`);
        console.error('Respuesta de la API no exitosa:', res);
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      alert('Error al procesar el pago. Por favor, intente nuevamente.');
    }
  };

  // Función para manejar la cancelación manual de una orden
  const handleCancel = (orderId: string, startTime: string) => async () => {
    const limitTime = new Date(startTime);
    const currentTime = new Date();
    limitTime.setHours(limitTime.getHours() - 2);

    if (currentTime > limitTime) {
      alert('No se puede cancelar la orden, debe ser al menos 2 horas antes del inicio.');
      return;
    } else {
      try {
        const res = await axios.put(`http://localhost:5000/api/orders/updatePayment?id=${orderId}`, {
          paymentStatus: 'Cancelado',
        });
        if (res.status === 200) {
          alert('Se canceló la orden correctamente');
          fetchClientOrders();
        }
      } catch (err) {
        console.error('Error al cancelar la orden:', err);
        alert('Error al cancelar la orden. Por favor, intente nuevamente.');
      }
    }
  };

  // Filtrar órdenes para mostrar solo las que cumplen con los criterios
  const today = new Date();
 
const validateHours = (today: Date, orderDate: Date) => {
  return orderDate >= today;
};

  const filteredOrders = orders.filter((order) => {
    const orderStartTime = new Date(order.startTime);  
    return (
      validateHours(today, orderStartTime) === true
    );
    
  });


  return (
    <div className="container">
      <h1>Tus ordenes {name}</h1>
      <div>
        {filteredOrders.length > 0 ? (
          <ul className="order-ul">
            {filteredOrders.map((order) => {

              const date = order.startTime.slice(5, 10);
              const time = order.startTime.slice(11, 16);
              return (
                <li key={order._id} className="order-item">
                  <strong>Total:</strong> ${order.totalPrice} -{' '}
                  <strong>Fecha:</strong> {date} -{' '}
                  <strong>Hora Inicio:</strong> {time} -{' '}
                  <strong>Estado Pago:</strong> {order.paymentStatus}
                  {order.stormRefund ? (
                    <span> (Reembolso por tormenta)</span>
                  ) : (
                    <>
                      {order.paymentStatus !== 'Cancelado' && (
                        <>
                          {order.paymentStatus !== 'Pagado' && (
                            <button className="order-btn" onClick={handlePay(order._id)}>Pagar</button>
                          )}
                          <button className="order-btn" onClick={handleCancel(order._id, order.startTime)}>Cancelar</button>
                        </>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No hay órdenes para mostrar.</p>
        )}
      </div>
      <Backbtn/>
    </div>
  );
};

export default UserInfoPage;
