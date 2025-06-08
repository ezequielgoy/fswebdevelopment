import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../styles/main.css';
import '../styles/homePage.css';

export default function HomePage() {
 const [name, setName] = useState('');
 const navigate = useNavigate();
 const handleNameChange = (e) =>{
  setName(e.target.value);
 }
 useEffect(() => {
  clearOrders();
  },[]);
 const newReserv = () => {
  if (!name){
    alert('Por favor, ingrese su nombre para continuar.');
    return;
  }
    if(name){
      navigate(`/order/${name}`);
    }
  }
  const showOrders = () =>{
   if (!name){
    alert('Por favor, ingrese su nombre para continuar.');
    return;
  } 
    if(name){
      navigate(`/viewOrder/${name}`);
    }
  }
const showAdmin = () =>{
  navigate('/admin');
}
const clearOrders = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/orders/getallorders');
    const allOrders: Order[] = res.data;

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const ordersToCancel = allOrders.filter(order => {
      const orderTime = new Date(order.startTime);
      return (
        order.paymentStatus === 'Pendiente' &&
        orderTime <= twoHoursLater
      );
    });

    for (const order of ordersToCancel) {
      try {
        await axios.put(`http://localhost:5000/api/orders/updatePayment?id=${order._id}`, {
          paymentStatus: 'Cancelado',
        });
        console.log(`Orden ${order._id} cancelada automáticamente.`);
      } catch (err) {
        console.error(`Error al cancelar la orden ${order._id}:`, err);
      }
    }
  } catch (err) {
    console.error('Error al obtener todas las órdenes:', err);
  }
};

  return (
    <div className="container">
      <nav className ="navbar">
        <button className="adminbtn" onClick={showAdmin}>Administrar</button>
      </nav>
      <h1>WaRental</h1>
      <h2>Reserve su equipo para sus vacaciones en la playa</h2>
      <div >
        <h2 className='input-title'>Ingrese su nombre</h2>
        <div className='input-container'>
        <input  type="text" placeholder="Nombre" value={name} onChange={handleNameChange} />
        <button onClick={newReserv}>Reservar</button>
        <button onClick={showOrders}>Ver Ordenes</button>
        </div>
      </div>
      

  </div>
  );
}