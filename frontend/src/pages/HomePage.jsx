import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

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
    if(name){
      navigate(`/order/${name}`);
    }
  }
  const showOrders = () =>{
    if(name){
      navigate(`/viewOrder/${name}`);
    }
  }

const clearOrders = async () =>{

}

  return (
    <div>
      <h1>Reserva tu equipo de playa</h1>
      <div>
        <h2>Ingrese su nombre</h2>
        <input type="text" placeholder="Nombre" value={name} onChange={handleNameChange} />
        <button onClick={newReserv}>Reservar</button>
        <button onClick={showOrders}>Ver Ordenes</button>
      </div>
  </div>
  );
}