let events = [];

fetch("https://script.google.com/macros/s/AKfycbzenkAI7Y6OfySx10hnpkaHfgXLshZYMhTt3L84SAmS5hr3UXBcvDZewPOD-donpORP/exec")
  .then(response => response.json())
  .then(data => {
    events = data.map(row => {
      const fecha = row.Fecha ? row.Fecha.split('T')[0] : null;
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(fecha);

      return {
        date: validDate ? fecha : null,
        title: row.Titulo || 'Sin título',
        time: row["Hora Inicio"] || '',
        type: row.Tipo || 'Otro',
        repeat: row.Repetir || '',
        error: !validDate
      };
    });

    generateCalendar(2025, 4); // mayo (mes 4 porque empieza en 0)
  });

function generateCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = (firstDay.getDay() + 6) % 7; // lunes como primer día
  const totalDays = lastDay.getDate();

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.classList.add('day');
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    const cellDate = dateObj.toISOString().split('T')[0];
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    const dateLabel = document.createElement('div');
    dateLabel.classList.add('date');
    dateLabel.textContent = day;
    dayCell.appendChild(dateLabel);

    const dayEvents = events.filter(e => {
      if (e.error) return false;
      if (e.repeat === 'semanal') {
        const eventDate = new Date(e.date);
        return eventDate.getDay() === dateObj.getDay() &&
               dateObj >= eventDate &&
               !(month === 11 && day > 15); // evitar después del 15 de diciembre
      }
      return e.date === cellDate;
    });

    dayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.classList.add('event');
      eventEl.classList.add(event.type);
      eventEl.textContent = (event.time ? event.time + ' ' : '') + event.title;
      dayCell.appendChild(eventEl);
    });

    calendar.appendChild(dayCell);
  }

  // Mostrar advertencias por fechas inválidas
  const errorEvents = events.filter(e => e.error && e.title);
  errorEvents.forEach(event => {
    const errorEl = document.createElement('div');
    errorEl.classList.add('event');
    errorEl.style.backgroundColor = '#ffcccc';
    errorEl.textContent = `⚠ ${event.title}: fecha inválida`;
    calendar.appendChild(errorEl);
  });
}
