import React, { useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DateTimeSelector from '../components/DateTimeSelector.tsx';

export default function OrderPage() {
  const { name } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [durationTurns, setDurationTurns] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [safetyGear, setSafetyGear] = useState(0);  
  const [payment, setPayment] = useState('Pendiente');
 



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
        safetyProduct: safetyGear,
        paymentStatus: payment
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
      <DateTimeSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        mode = 'single'
        dayRangeInHours={48}
        />
      <div style={{ marginBottom: '1em' }}>
        <h3>Duración del turno:</h3>
        <select value={durationTurns} onChange={(e) => setDurationTurns(e.target.value)}>
          <option value={1}>30 minutos</option>
          <option value={2}>1 hora</option>
          <option value={3}>1 hora 30 min</option>
        </select>
      </div>
      <button onClick={fetchAvailableProducts} disabled={!selectedDate || !selectedTime}>
        Consultar disponibilidad
      </button>

      <h3>Productos disponibles en el horario elegido</h3>
      {products.map(p => (
        <div key={p._id}>
        <label>
          {p.name} {p.category} - ${p.price} - Disponibles: {p.availableQuantity}
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
              Cuantos equipos de seguridad necesita({min} a {max}): 
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
    <div>
      <h3>Seleccione metodo de pago</h3>
      <label>
        <input
          type="radio"
          value="Pendiente"
          checked={payment === 'Pendiente'}
          onChange={() => setPayment('Pendiente')}
        />
        Efectivo
        </label>
        <label>
        <input
          type="radio"
          value="Pagado"
          checked={payment === 'Pagado'}
          onChange={() => setPayment('Pagado')}
        />
        Tarjeta
        </label>
    </div>
    <button onClick={sendOrder}>Reservar turno</button>
    </div>
  );
}
