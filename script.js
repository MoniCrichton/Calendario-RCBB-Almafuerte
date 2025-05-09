let events = [];

fetch("https://opensheet.vercel.app/1IPzWW3MzGUbzIxvRJO4mL0iMgnOpnBowQGlfPUz8/Eventos")
  .then(response => response.json())
  .then(data => {
    if (!Array.isArray(data)) {
      console.error("La respuesta no es una lista:", data);
      return;
    }

    events = data.map((row) => {
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(row.Fecha);
      return {
        date: validDate ? row.Fecha : null,
        title: row['Título'] || 'Sin título',
        time: row['Hora inicio'] || '',
        type: row['Tipo'] || 'Otro',
        repeat: row['Repetir'] || '',
        error: !validDate
      };
    });

    generateCalendar(2025, 4); // mayo 2025 (mes 4 porque enero=0)
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
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

      // Repeticiones semanales
      if (e.repeat.toLowerCase() === 'semanal') {
        const original = new Date(e.date);
        return dateObj.getDay() === original.getDay() &&
               dateObj >= original &&
               !(month === 11 && day > 15); // pausa en diciembre
      }

      // Evento puntual
      return e.date === cellDate;
    });

    dayEvents.forEach(event => {
      const el = document.createElement('div');
      el.classList.add('event');
      el.classList.add(event.type); // para aplicar color
      el.textContent = (event.time ? event.time + ' ' : '') + event.title;
      dayCell.appendChild(el);
    });

    calendar.appendChild(dayCell);
  }

  // Mostrar advertencias por errores
  const errorEvents = events.filter(e => e.error && e.title);
  errorEvents.forEach(event => {
    const errorEl = document.createElement('div');
    errorEl.classList.add('event');
    errorEl.style.backgroundColor = '#ffcccc';
    errorEl.textContent = `⚠ ${event.title}: fecha inválida`;
    calendar.appendChild(errorEl);
  });
}
