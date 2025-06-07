import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

  // useEffect para obtener las órdenes y cancelar automáticamente las que correspondan
  useEffect(() => {
    const processOrders = async () => {
      await fetchClientOrders();

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
    };

    processOrders();
  }, [name]);

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

    if (today.getDate() <= orderDate.getDate()){
      if (today.getDate() === orderDate.getDate()){
        if (today.getHours() >= orderDate.getHours()){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    }else {
      return false;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderStartTime = new Date(order.startTime);  
    return (
      validateHours(today, orderStartTime) === true
    );
  });

  return (
    <div>
      <h1>Tus Órdenes {name}</h1>
      <div>
        {filteredOrders.length > 0 ? (
          <ul>
            {filteredOrders.map((order) => {
              const orderStartTime = new Date(order.startTime);
              const day = orderStartTime.getDate().toString().padStart(2, '0');
              const month = (orderStartTime.getMonth() + 1).toString().padStart(2, '0');
              const hours = orderStartTime.getHours().toString().padStart(2, '0');
              const minutes = orderStartTime.getMinutes().toString().padStart(2, '0');

              return (
                <li key={order._id}>
                  <strong>Total:</strong> ${order.totalPrice} -{' '}
                  <strong>Fecha:</strong> {day}/{month} -{' '}
                  <strong>Hora Inicio:</strong> {hours}:{minutes} -{' '}
                  <strong>Estado Pago:</strong> {order.paymentStatus}
                  {order.stormRefund ? (
                    <span> (Reembolso por tormenta)</span>
                  ) : (
                    <>
                      {order.paymentStatus !== 'Cancelado' && (
                        <>
                          {order.paymentStatus !== 'Pagado' && (
                            <button onClick={handlePay(order._id)}>Pagar</button>
                          )}
                          <button onClick={handleCancel(order._id, order.startTime)}>Cancelar</button>
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
    </div>
  );
};

export default UserInfoPage;
