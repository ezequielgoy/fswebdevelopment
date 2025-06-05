import React, { useState } from 'react';
import DateTimeSelector from '../components/DateTimeSelector';
/*

export default function HomePage() {
 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');


  return (
    <div>
      <h1>Reserva tu equipo de playa</h1>
      <div>
      <DateTimeSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setselectedTime={setSelectedTime}
        selectedEndTime={selectedEndTime}
        setSelectedEndTime={setSelectedEndTime}
        mode = 'range'
        dayRangeInHours={48}
        />
      </div>
  </div>
  );
}
*/


export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isValidRange, setIsValidRange] = useState(false);

  const handleConfirm = () => {
    if (!isValidRange) return;
    console.log('🗓 Fecha:', selectedDate);
    console.log('⏱ Rango horario:', startTime, 'a', endTime);
    // Aquí podrías realizar alguna consulta, enviar a backend, etc.
  };

  return (
    <div>
      <h1>Administrador - Seleccionar franja horaria</h1>

      <DateTimeSelector
        mode="range"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={{ startTime, endTime }}
        setSelectedTime={({ startTime, endTime }) => {
          setStartTime(startTime);
          setEndTime(endTime);
        }}
        setIsValidRange={setIsValidRange}
      />

      <button
        onClick={handleConfirm}
        disabled={!isValidRange}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: isValidRange ? '#007bff' : '#ccc',
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