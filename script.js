let events = [];

fetch("https://script.google.com/macros/s/AKfycbzenkAI7Y6OfySx10hnpkaHfgXLshZYMhTt3L84SAmS5hr3UXBcvDZewPOD-donpORP/exec")
  .then(response => response.json())
  .then(data => {
    events = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);

      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Titulo || '').trim() || 'Sin título',
        time: row['Hora Inicio'] || '',
        type: (row.Tipo || 'Otro').trim().toLowerCase(),
        repeat: (row.Repetir || '').trim().toLowerCase(),
        error: !esFechaValida
      };
    });
    generateCalendar(2025, 4); // Mayo 2025
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
    const dateObj = new Date(Date.UTC(year, month, day));
    const cellDate = dateObj.toISOString().split('T')[0];
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    const dateLabel = document.createElement('div');
    dateLabel.classList.add('date');
    dateLabel.textContent = day;
    dayCell.appendChild(dateLabel);

    const dayEvents = events.filter(e => {
      if (e.error) return false;
      const eventDate = new Date(e.date + 'T00:00:00Z');

      if (e.repeat === 'semanal') {
        return eventDate.getUTCDay() === dateObj.getUTCDay() && dateObj >= eventDate;
      }
      if (e.repeat === 'anual') {
        return (
          eventDate.getUTCDate() === dateObj.getUTCDate() &&
          eventDate.getUTCMonth() === dateObj.getUTCMonth()
        );
      }
      return e.date === cellDate;
    });

    dayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.classList.add('event');

      const tipo = event.type.toLowerCase();
      const colores = {
        'cumpleaños': '#d1e7ff',
        'reunión': '#d4edda',
        'cena': '#ffeeba',
        'aniversario': '#ffe9a9',
        'feriado': '#f8d7da',
        'otro': '#e2e3e5'
      };
      eventEl.style.backgroundColor = colores[tipo] || '#e2e3e5';

      if (tipo === 'cumpleaños') {
        eventEl.textContent = `🎂 ${event.title}`;
      } else if (tipo === 'aniversario') {
        const yearStart = new Date(event.rawDate).getFullYear();
        const currentYear = dateObj.getUTCFullYear();
        const years = currentYear - yearStart;
        eventEl.textContent = `${event.title} (${years} años)`;
        eventEl.style.fontWeight = 'bold';
      } else {
        eventEl.textContent = (event.time ? event.time + ' ' : '') + event.title;
      }

      dayCell.appendChild(eventEl);
    });

    calendar.appendChild(dayCell);
  }

  const errorEvents = events.filter(e => e.error && e.title);
  errorEvents.forEach(event => {
    const errorEl = document.createElement('div');
    errorEl.classList.add('event');
    errorEl.style.backgroundColor = '#ffcccc';
    errorEl.textContent = `⚠ ${event.title}: fecha inválida`;
    calendar.appendChild(errorEl);
  });
}
