// script.js
let events = [];
let consignas = [];
let cumpleaños = [];
let feriados = [];
let emojis = {};
let currentDate = new Date();
let datosListos = {
  emojis: false,
  consignas: false,
  cumpleaños: false,
  feriados: false,
  eventos: false
};

function intentarGenerarCalendario() {
  if (Object.values(datosListos).every(v => v)) {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }
}

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Emojis")
  .then(response => response.json())
  .then(data => {
    console.log("🔵 Datos recibidos desde Emojis:", data);
    emojis = data.reduce((acc, row) => {
      const tipo = (row.tipo || '').trim().toLowerCase();
      const emoji = (row.emoji || '').trim();
      const color = (row.color || '').trim();
      if (tipo) {
        acc[tipo] = {
          emoji: emoji,
          color: color || '#e2e3e5'
        };
      }
      return acc;
    }, {});
    console.log("✅ Emojis cargados:", emojis);
    datosListos.emojis = true;
    intentarGenerarCalendario();
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Consignas")
  .then(res => res.json())
  .then(data => {
    consignas = data.map(row => ({
      anio: parseInt(row.Año),
      mes: parseInt(row.Mes),
      texto: row.Consigna
    }));
    datosListos.consignas = true;
    intentarGenerarCalendario();
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Cumpleaños")
  .then(res => res.json())
  .then(data => {
    cumpleaños = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);
      const mostrarEdad = (row.MostrarEdad || '').trim().toUpperCase() === 'S';
      const añoNacimiento = esFechaValida ? fecha.getFullYear() : null;

      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Nombre || '').trim() || 'Sin título',
        time: '',
        type: 'cumpleaños',
        repeat: 'anual',
        hasta: null,
        error: !esFechaValida,
        mostrarEdad: mostrarEdad,
        añoNacimiento: mostrarEdad ? añoNacimiento : null
      };
    });
    datosListos.cumpleaños = true;
    intentarGenerarCalendario();
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Feriados")
  .then(res => res.json())
  .then(data => {
    feriados = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);
      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: ((row.Tipo || '').trim().toLowerCase() === 'feriado' ? 'Feriado: ' : '') + ((row.Conmemoracion || '').trim() || 'Feriado'),
        time: '',
        type: (row.Tipo || 'feriado').trim().toLowerCase(),
        repeat: 'anual',
        hasta: null,
        error: !esFechaValida,
        feriadoTipo: (row.Tipo || '').trim()
      };
    });
    datosListos.feriados = true;
    intentarGenerarCalendario();
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
    events = [...cumpleaños, ...feriados, ...procesados];
    datosListos.eventos = true;
    intentarGenerarCalendario();
  });

function generateCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const header = document.getElementById('month-header');
  const consignaDiv = document.getElementById('consigna-mensual');
  const mesActual = document.getElementById('mes-actual');
  if (mesActual) {
    mesActual.innerHTML = `
      <div class="header-logo-titulo">
        <img src="assets/rotary-logo.png" alt="Rotary Logo" class="rotary-logo" />
        <span>${firstDay.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
      </div>`;
  }
  const consigna = consignas.find(c => c.anio === year && c.mes === (month + 1));
  consignaDiv.textContent = consigna ? consigna.texto : '';

  if (window.innerWidth > 600) {
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('day', 'vacio');
      calendar.appendChild(empty);
    }
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    const cellDate = dateObj.toISOString().split('T')[0];
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    const hoyLocal = new Date();
    const hoyStr = hoyLocal.getFullYear() + '-' +
                   String(hoyLocal.getMonth() + 1).padStart(2, '0') + '-' +
                   String(hoyLocal.getDate()).padStart(2, '0');
    if (hoyStr === cellDate) dayCell.classList.add('hoy');

    const dateLabel = document.createElement('div');
    dateLabel.classList.add('date');
    const weekDay = dateObj.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase();
    dateLabel.innerHTML = `<span class='week-day'>${weekDay}</span> <span class='day-number'>${day}</span>`;
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
      const ordenTipo = {
        'cumpleaños': 0,
        'efeméride': 1,
        'feriado': 2,
        'evento': 3,
        'otro': 4
      };
      const prioridadA = ordenTipo[a.type] ?? 99;
      const prioridadB = ordenTipo[b.type] ?? 99;
      if (prioridadA !== prioridadB) return prioridadA - prioridadB;
      const tieneHoraA = a.time && a.time.trim() !== '';
      const tieneHoraB = b.time && b.time.trim() !== '';
      if (tieneHoraA !== tieneHoraB) return tieneHoraA ? 1 : -1;
      if (tieneHoraA && tieneHoraB) return a.time.localeCompare(b.time);
      return 0;
    });

    dayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.classList.add('event');
      const tipo = event.type;
      const estilo = emojis[tipo] || { emoji: '', color: '#e2e3e5' };
      const emoji = estilo.emoji;
      const color = estilo.color;

      let texto = `${emoji} `;
      if (tipo === 'cumpleaños' && event.mostrarEdad && typeof event.añoNacimiento === 'number') {
        const edad = year - event.añoNacimiento;
        texto += `${event.title} (${edad} años)`;
      } else {
        texto += `${event.time ? event.time + ' ' : ''}${event.title}`;
      }
      eventEl.textContent = texto;
      eventEl.style.backgroundColor = color;
      dayCell.appendChild(eventEl);
    });

    calendar.appendChild(dayCell);
  }

  setTimeout(() => {
    const hoy = document.querySelector('.hoy');
    if (hoy && window.innerWidth <= 600) {
      hoy.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function cambiarMes(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}
