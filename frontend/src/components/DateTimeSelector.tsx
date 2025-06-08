import React from 'react';
import '../styles/main.css';

type Props = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedEndTime?: string;
  setSelectedEndTime?: (time: string) => void;
  mode?: 'single' | 'range';
  hourStart?: number;
  hourEnd?: number;
};

const DateTimeSelector: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedEndTime = '',
  setSelectedEndTime = () => {},
  mode = 'single',
  hourStart = 9,
  hourEnd = 18,
}) => {
  const now = new Date();
  const deadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const formatDateLabel = (date: Date): string => {
    const labelDate = date.toISOString().slice(0, 10);
    const today = now.toISOString().slice(0, 10);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const formatted = `${day}/${month}`;

    if (labelDate === today) return `Hoy (${formatted})`;
    if (labelDate === tomorrowStr) return `Mañana (${formatted})`;

    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `En ${diffDays} días (${formatted})`;
  };

  const getAvailableDates = (): { value: string; label: string }[] => {
    const dates: { value: string; label: string }[] = [];
    let tempDate = new Date(now);
    tempDate.setHours(0, 0, 0, 0);

    while (tempDate <= deadline) {
      const value = tempDate.toISOString().slice(0, 10);
      dates.push({
        value,
        label: formatDateLabel(new Date(tempDate)),
      });
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return dates;
  };

  const getTimeSlots = (dateStr: string): string[] => {
    const slots: string[] = [];
    const date = new Date(dateStr + 'T00:00:00');
    const isToday = date.toDateString() === now.toDateString();

    for (let h = hourStart; h <= hourEnd; h++) {
      for (let m of [0, 30]) {
        if (h === hourEnd && m > 0) continue;

        const slot = new Date(date);
        slot.setHours(h, m, 0, 0);

        if (slot < now) continue;
        if (slot > deadline) continue;

        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }

    return slots;
  };

  const dateOptions = getAvailableDates();
  const timeOptions = selectedDate ? getTimeSlots(selectedDate) : [];

  return (
    <div className=".container" >
      <div>
        <h3>Seleccioná un día:</h3>
        {dateOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setSelectedDate(opt.value);
              setSelectedTime('');
              setSelectedEndTime('');
            }}>
            {opt.label}
          </button>
        ))}
      </div>

      {selectedDate && timeOptions.length > 0 && (
        <div >
          <h3>Seleccioná horario{mode === 'range' ? 's' : ''}:</h3>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            
          >
            <option value="">-- Hora inicio --</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          {mode === 'range' && (
            <select
              value={selectedEndTime}
              onChange={(e) => setSelectedEndTime(e.target.value)}
            >
              <option value="">-- Hora fin --</option>
              {timeOptions
                .filter((time) => {
                  if (!selectedTime) return true;
                  const [h1, m1] = selectedTime.split(':').map(Number);
                  const [h2, m2] = time.split(':').map(Number);
                  return h2 > h1 || (h2 === h1 && m2 > m1);
                })
                .map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
