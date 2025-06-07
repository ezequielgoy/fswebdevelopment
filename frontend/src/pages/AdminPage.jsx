import React, { useState } from 'react';
import DateTimeSelector from '../components/DateTimeSelector.tsx';
import axios from 'axios';

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');


  const handleConfirm = async () => {
    
      try{
        if(selectedTime && selectedEndTime && selectedTime < selectedEndTime){
          const res = await axios.put('http://localhost:5000/api/orders/stormRefund',{
          startTime: selectedDate + 'T' + selectedTime + ':00.000Z',
          endTime: selectedDate + 'T' + selectedEndTime + ':00.000Z'
          })
        if (res.status === 200){
          alert('Horario confirmado se realizo la cancelacion de las ordenes por tormenta')
        }else{
         alert('Por favor, selecciona un rango horario válido');
        }
    }
    }catch(err){
      alert('Error al confirmar horario: ' + (err.response?.data?.message || 'Error desconocido del servidor.'));
    }
    };  
    
  

  return (
    <div>
      <h1>Administrador - Seleccionar franja horaria</h1>

      <DateTimeSelector
        mode="range"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedEndTime={selectedEndTime}
        setSelectedEndTime={setSelectedEndTime}
      />

      <button
        onClick={handleConfirm}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff' ,
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Confirmar horario
      </button>
    </div>
  );
}