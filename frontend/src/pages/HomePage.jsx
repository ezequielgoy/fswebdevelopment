import React, { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [durationTurns, setDurationTurns] = useState(1);
  const [products, setProducts] = useState([]);

  const availableHours = generateTimeSlots();

  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    slots.push("18:00");
    return slots;
  }

  function getDateISO(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    return date.toISOString();
  }

  const fetchAvailableProducts = async () => {
    if (!selectedDate || !selectedTime) return;
    const startTime = getDateISO(selectedDate, selectedTime);
    try {
      const res = await axios.get('http://localhost:5000/api/orders/available', {
        params: {
          startTime,
          durationTurns
        }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error al consultar productos disponibles:', err);
    }
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const dateOptions = [
  {
    label: `Hoy (${formatDate(today)})`,
    value: today.toISOString().slice(0, 10)
  },
  {
    label: `Mañana (${formatDate(tomorrow)})`,
    value: tomorrow.toISOString().slice(0, 10)
  }
];

  return (
    <div>
      <h1>Reserva tu equipo de playa</h1>

      <div style={{ marginBottom: '1em' }}>
        <h3>Seleccioná un día:</h3>
        {dateOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSelectedDate(opt.value)}
            style={{
              marginRight: '10px',
              backgroundColor: selectedDate === opt.value ? 'lightblue' : 'white'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div style={{ marginBottom: '1em' }}>
          <h3>Seleccioná un horario:</h3>
          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            <option value="">-- Elegí una hora --</option>
            {availableHours.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      )}

      {selectedTime && (
        <div style={{ marginBottom: '1em' }}>
          <h3>Duración del turno:</h3>
          <select value={durationTurns} onChange={(e) => setDurationTurns(e.target.value)}>
            <option value={1}>30 minutos</option>
            <option value={2}>1 hora</option>
            <option value={3}>1 hora 30 min</option>
          </select>
        </div>
      )}

      <button onClick={fetchAvailableProducts} disabled={!selectedDate || !selectedTime}>
        Consultar disponibilidad
      </button>

      <h2>Productos disponibles</h2>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} ({p.category}) - ${p.price} - Disponibles: {p.availableQuantity}
          </li>
        ))}
      </ul>
    </div>
  );
}