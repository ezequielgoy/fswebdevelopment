import React, { useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function OrderPage() {
  const { name } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [durationTurns, setDurationTurns] = useState(1);
  const [products, setProducts] = useState([]);
const [selectedQuantities, setSelectedQuantities] = useState({});
const [safetyGear, setSafetyGear] = useState(0);   
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
const handleQuantityChange = (productId, max, value) => {
  const val = Math.min(Math.max(parseInt(value) || 0, 0), max);
  setSelectedQuantities(prev => ({ ...prev, [productId]: val }));
};
const calculateRequiredSafetyGear = () => {
  let totalVehicles = 0;

  products.forEach(p => {
    if (['jetsky', 'cuatriciclo'].includes(p.name.toLowerCase())) {
      totalVehicles += selectedQuantities[p._id] || 0;
    }
  });

  return {
    min: totalVehicles,
    max: totalVehicles * 2
  };
};

const sendOrder = async () => {
  const startTime = getDateISO(selectedDate, selectedTime);
  const orderItems = products
    .filter(p => selectedQuantities[p._id] && selectedQuantities[p._id] > 0)
    .map(p => ({
      product: p._id,
      quantity: selectedQuantities[p._id],
    }));

  if (orderItems.length === 0) {
    return alert('Seleccioná al menos un producto.');
  }

  // Contar jetskys y cuatriciclos usando selectedQuantities
  const jetskyAndQuadCount = products.reduce((acc, p) => {
    if (['jetsky', 'cuatriciclo'].includes(p.name.toLowerCase())) {
      return acc + (selectedQuantities[p._id] || 0);
    }
    return acc;
  }, 0);

  if (jetskyAndQuadCount > 0) {
    const min = jetskyAndQuadCount;
    const max = jetskyAndQuadCount * 2;
    if (safetyGear < min || safetyGear > max) {
      return alert(`Debes seleccionar entre ${min} y ${max} productos de seguridad.`);
    }
  }

  try {
    await axios.post('http://localhost:5000/api/orders', {
      client: name,
      orderItems,
      startTime,
      durationTurns,
      safetyProduct: safetyGear
    });

    alert('Orden enviada correctamente');
  } catch (err) {
    console.error('Error al enviar orden:', err);
    alert('Hubo un error al enviar la orden.');
  }
};
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
{products.map(p => (
  <div key={p._id}>
    <label>
      {p.name} ({p.category}) - ${p.price} - Disponibles: {p.availableQuantity}
      <input
        type="number"
        min="0"
        max={p.availableQuantity}
        value={selectedQuantities[p._id] || ''}
        onChange={(e) => handleQuantityChange(p._id, p.availableQuantity, e.target.value)}
        style={{ marginLeft: '10px', width: '50px' }}
      />
    </label>
  </div>
))}


{(() => {
  const { min, max } = calculateRequiredSafetyGear();
  return min > 0 && (
    <div>
      <label>
        Equipos de seguridad necesarios ({min} a {max}): 
        <input
          type="number"
          min={min}
          max={max}
          value={safetyGear}
          onChange={(e) => setSafetyGear(Number(e.target.value))}
          style={{ marginLeft: '10px', width: '50px' }}
        />
      </label>
    </div>
  );
})()}
<button onClick={sendOrder}>Reservar turno</button>
    </div>
  );
}