import React, { useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


export default function HomePage() {
const { name } = useParams();
const [orders,setOrders] = React.useState([]);
useEffect(() => {
  fetchClientOrders();
});
const fetchClientOrders = async () =>{
  try{
    const res = await axios.get('http://localhost:5000/api/orders/byName', {
      params: {
        name
      }
    });
    const fetchedOrders = res.data.map(order => ({
    ...order,
  startTime: new Date(order.startTime) // Convertir la cadena de fecha a objeto Date
}));
setOrders(fetchedOrders);
    setOrders(fetchedOrders);

  }catch(err){
    console.error('Error al obtener ordenes del cliente',err);
  }

}

const handlePay = (orderId) => async () => {
  try {
    const res = await axios.put(`http://localhost:5000/api/orders/updatePayment?id=${orderId}`, {
      paymentStatus: 'Pagado'
    });
    if(res.status === 200){
      alert('Pago realizado correctamente');
    }else{
      alert(`Error al procesar el pago: ${res.data.message || 'Error desconocido del servidor.'}`);
      console.error('Respuesta de la API no exitosa:', res);
    }
    
    fetchClientOrders(); // Refresh orders after payment
  } catch (err) {
  }
}
const handleCancel = (orderId, startTime) => async () => {
  const limitTime = new Date(startTime);
  const currentTime = new Date();
  limitTime.setHours(limitTime.getUTCHours() - 2);
  
  if (currentTime > limitTime) {
    alert('No se puede cancelar la orden, debe ser al menos 2 horas antes del inicio.');
    return;
  }else{
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/updatePayment?id=${orderId}`, {
       paymentStatus: 'Cancelado'
      });
          if(res.status === 200){
      alert('Se cancelo la orden correctamente');}
      fetchClientOrders(); // Refresh orders after payment
    } catch (err) {
      console.error('Error al cancelar la orden:', err);
      alert('Error al cancelar la orden. Por favor, intente nuevamente.');
    }
  }
}


  const currentTime = new Date();
  const filteredOrders = orders.filter(order => {
    // Filter out canceled orders and past orders
    return order.paymentStatus !== 'Cancelado' &&
           order.startTime instanceof Date &&
           order.startTime >= currentTime;
  });

  return (
    <div>
      <h1>Tus Ordenes {name}</h1>
      <div>
        {orders.length > 0 ? (
          <ul>
            {filteredOrders.map((order) => (
              <li key={order._id}>
                <strong>Total:</strong> ${order.totalPrice} -
                <strong>Fecha:</strong> {new Date(order.startTime).getUTCDate()}/{new Date(order.startTime).getMonth()} -
                <strong>Hora Inicio:</strong> {new Date(order.startTime).getUTCHours()}:{new Date(order.startTime).getUTCMinutes()} -
                <strong>Estado Pago:</strong> {order.paymentStatus}
                {order.stormRefund ? (
                  <span> (Reembolso por tormenta)</span>
                ) : (
                  <>
                    <button onClick={handlePay(order._id)}>Pagar</button>
                    <button onClick={handleCancel(order._id, order.startTime)}>Cancelar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay ordenes para mostrar.</p>
        )}
        </div>
  </div>
  );
}