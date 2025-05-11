// script.js
let events = [];
let consignas = [];
let cumpleaños = [];
let emojis = {};
let currentDate = new Date();

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Emojis")
  .then(response => response.json())
  .then(data => {
    emojis = data.reduce((acc, row) => {
      const tipo = (row.Tipo || '').trim().toLowerCase();
      const emoji = (row.Emoji || '').trim();
      if (tipo && emoji) acc[tipo] = emoji;
      return acc;
    }, {});
    verificarInicio();
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Consignas")
  .then(res => res.json())
  .then(data => {
    consignas = data.map(row => ({
      anio: parseInt(row.Año),
      mes: parseInt(row.Mes),
      texto: row.Consigna
    }));
    verificarInicio();
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Cumpleaños")
  .then(res => res.json())
  .then(data => {
    const hoy = new Date();
    cumpleaños = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);
      const mostrarEdad = (row.MostrarEdad || '').trim().toUpperCase() === 'S';

      let edad = null;
      if (esFechaValida && mostrarEdad) {
        edad = hoy.getFullYear() - fecha.getFullYear();
        const cumpleEsteAño = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate());
        if (cumpleEsteAño > hoy) edad--;
      }

      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Nombre || '').trim() || 'Sin título',
        time: '',
        type: 'cumpleaños',
        repeat: 'anual',
        hasta: null,
        error: !esFechaValida,
        edad: mostrarEdad ? edad : null
      };
    });
    verificarInicio();
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Feriados")
  .then(res => res.json())
  .then(data => {
    const feriados = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);
      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Conmemoracion || '').trim() || 'Feriado',
        time: '',
        type: 'feriado',
        repeat: 'anual',
        hasta: null,
        error: !esFechaValida,
        feriadoTipo: (row.Tipo || '').trim()
      };
    });
    events = feriados.concat(events);
    verificarInicio();
  });

fetch("https://script.google.com/macros/s/AKfycbzenkAI7Y6OfySx10hnpkaHfgXLshZYMhTt3L84SAmS5hr3UXBcvDZewPOD-donpORP/exec")
  .then(res => res.json())
  .then(data => {
    const procesados = data.map(row => {
      const fecha = new Date(row.Fecha);
      const hasta = row.Hasta ? new Date(row.Hasta) : null;
      const esFechaValida = !isNaN(fecha);

      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Titulo || '').trim() || 'Sin título',
        time: row['Hora Inicio'] ? row['Hora Inicio'].trim() : '',
        type: (row.Tipo || 'otro').trim().toLowerCase(),
        repeat: (row.Repetir || '').trim().toLowerCase(),
        hasta: hasta,
        error: !esFechaValida
      };
    });
    events = cumpleaños.concat(events).concat(procesados);
    verificarInicio();
  });

function verificarInicio() {
  if (emojis && consignas.length > 0 && events.length > 0) {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }
}

function cambiarMes(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

function generateCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const header = document.getElementById('month-header');
  header.querySelector('#mes-actual').textContent = firstDay.toLocaleString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase();

  const consigna = consignas.find(c => c.anio === year && c.mes === (month + 1));
  const consignaDiv = document.getElementById('consigna-mensual');
  consignaDiv.textContent = consigna ? consigna.texto : '';

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.classList.add('day');
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day); // sin UTC
    const cellDate = dateObj.toISOString().split('T')[0];
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    const dateLabel = document.createElement('div');
    dateLabel.classList.add('date');
    const weekDay = dateObj.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase();
    dateLabel.textContent = `${day} ${weekDay}`;
    dayCell.appendChild(dateLabel);

    const dayEvents = events.filter(e => {
      if (e.error) return false;
      const eventDate = new Date(e.date + 'T00:00:00Z');
      const hasta = e.hasta instanceof Date && !isNaN(e.hasta) ? e.hasta : null;

      if (e.repeat === 'semanal') {
        return eventDate.getUTCDay() === dateObj.getUTCDay() && dateObj >= eventDate && (!hasta || dateObj <= hasta);
      }
      if (e.repeat === 'anual') {
        return eventDate.getUTCDate() === dateObj.getUTCDate() && eventDate.getUTCMonth() === dateObj.getUTCMonth() && (!hasta || dateObj <= hasta);
      }
      return e.date === cellDate;
    });

    dayEvents.sort((a, b) => {
      const orden = { 'cumpleaños': 0, 'feriado': 1, 'reunión': 2, 'conferencia': 3, 'cena': 4, 'actividad membresia': 5, 'evento': 6, 'ri': 7, 'otro': 99 };
      return (orden[a.type] || 99) - (orden[b.type] || 99);
    });

    dayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.classList.add('event');
      const tipo = event.type;
      const emoji = emojis[tipo] || '';

      if (tipo === 'cumpleaños') {
        let texto = `${emoji} ${event.title}`;
        if (typeof event.edad === 'number') {
          texto += ` (${event.edad} años)`;
        }
        eventEl.textContent = texto;
        eventEl.style.backgroundColor = '#d1e7ff';

      } else if (tipo === 'aniversario') {
        const yearStart = new Date(event.rawDate).getFullYear();
        const currentYear = dateObj.getUTCFullYear();
        const years = currentYear - yearStart;
        eventEl.textContent = `${emoji} ${event.title} (${years} años)`;
        eventEl.style.fontWeight = 'bold';
        eventEl.style.backgroundColor = '#ffe9a9';

      } else if (tipo === 'feriado') {
        eventEl.textContent = `${emoji} ${event.title}`;
        eventEl.style.backgroundColor = '#f8d7da';

      } else {
        eventEl.textContent = `${emoji} ${event.time ? event.time + ' ' : ''}${event.title}`;
        eventEl.style.backgroundColor = '#e2e3e5';
      }

      dayCell.appendChild(eventEl);
    });

    calendar.appendChild(dayCell);
  }
}
