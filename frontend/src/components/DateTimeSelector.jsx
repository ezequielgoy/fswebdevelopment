import React, { useMemo } from 'react';

export default function DateTimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedEndTime,
  setSelectedEndTime,
  mode = 'single',             // 'single' o 'range'
  hourStart = 9,
  hourEnd = 18,
  dayRangeInHours = 48,
}) {
  const now = new Date();
  const deadline = new Date(now.getTime() + dayRangeInHours * 60 * 60 * 1000);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = hourStart; hour < hourEnd; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    slots.push(`${hourEnd}:00`);
    return slots;
  };

  const dateOptions = useMemo(() => {
    const options = [];
    const current = new Date(now);
    while (current <= deadline) {
      const iso = current.toISOString().slice(0, 10);
      const diffDays = Math.floor((current - now) / (1000 * 60 * 60 * 24));
      const label = diffDays === 0
        ? `Hoy (${formatDate(current)})`
        : diffDays === 1
        ? `Mañana (${formatDate(current)})`
        : `En ${diffDays} días (${formatDate(current)})`;
      options.push({ value: iso, label });
      current.setDate(current.getDate() + 1);
    }
    return options;
  }, [now, deadline]);

  const availableHours = useMemo(() => {
    if (!selectedDate) return [];
    const slots = generateTimeSlots();
    const slotDateTime = (dateStr, timeStr) => {
      const [hour, min] = timeStr.split(':');
      const d = new Date(dateStr);
      d.setHours(parseInt(hour), parseInt(min), 0, 0);
      return d;
    };
    return slots.filter(slot => {
      const dateTime = slotDateTime(selectedDate, slot);
      return dateTime >= now && dateTime <= deadline;
    });
  }, [selectedDate, now, deadline]);

  const isValidRange =
    mode === 'range' && selectedTime && selectedEndTime && selectedTime < selectedEndTime;

  return (
    <>
      <div style={{ marginBottom: '1em' }}>
        <h3>Seleccioná un día:</h3>
        {dateOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => {
              setSelectedDate(opt.value);
              setSelectedTime('');
              setSelectedEndTime && setSelectedEndTime('');
            }}
            style={{
              marginRight: '10px',
              backgroundColor: selectedDate === opt.value ? 'lightblue' : 'white'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {selectedDate && availableHours.length > 0 && (
        <div style={{ marginBottom: '1em' }}>
          <h3>Seleccioná horario{mode === 'range' ? 's' : ''}:</h3>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{ marginRight: '1em' }}
          >
            <option value="">-- Hora inicio --</option>
            {availableHours.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          {mode === 'range' && (
            <select
              value={selectedEndTime}
              onChange={(e) => setSelectedEndTime(e.target.value)}
            >
              <option value="">-- Hora fin --</option>
              {availableHours.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Si se desea deshabilitar un botón desde el componente padre, se puede usar isValidRange */}
    </>
  );
}
