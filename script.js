let events = [];
let consignas = [];
let cumpleaños = [];
let currentDate = new Date(2025, 4); // Mayo 2025

// Cargar eventos generales
fetch("https://script.google.com/macros/s/AKfycbzenkAI7Y6OfySx10hnpkaHfgXLshZYMhTt3L84SAmS5hr3UXBcvDZewPOD-donpORP/exec")
  .then(response => response.json())
  .then(data => {
    events = data.map(row => {
      const fecha = new Date(row.Fecha);
      const hasta = row.Hasta ? new Date(row.Hasta) : null;
      const esFechaValida = !isNaN(fecha);

      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Titulo || '').trim() || 'Sin título',
        time: row['Hora Inicio'] ? row['Hora Inicio'].trim() : '',
        type: (row.Tipo || 'Otro').trim().toLowerCase(),
        repeat: (row.Repetir || '').trim().toLowerCase(),
        hasta: hasta,
        error: !esFechaValida
      };
    });
    verificarInicio();
  });

// Cargar consignas mensuales
fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Consignas")
  .then(response => response.json())
  .then(data => {
    consignas = data.map(row => ({
      anio: parseInt(row.Año),
      mes: parseInt(row.Mes),
      texto: row.Consigna
    }));
    verificarInicio();
  });

// Cargar cumpleaños desde hoja separada
fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Cumpleaños")
  .then(response => response.json())
  .then(data => {
    const cumpleañosMapeados = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);
      const mostrarEdad = (row.MostrarEdad || '').trim().toUpperCase() === 'S';

      let edad = null;
      if (esFechaValida && mostrarEdad) {
        const hoy = new Date();
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
    events = events.concat(cumpleañosMapeados);
    verificarInicio();
  });

function verificarInicio() {
  if (events.length > 0 && consignas.length > 0) {
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
  header.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '←';
  prevBtn.onclick = () => cambiarMes(-1);
  prevBtn.style.float = 'left';
  prevBtn.style.fontSize = '1.2rem';
  prevBtn.style.margin = '0 1rem';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '→';
  nextBtn.onclick = () => cambiarMes(1);
  nextBtn.style.float = 'right';
  nextBtn.style.fontSize = '1.2rem';
  nextBtn.style.margin = '0 1rem';

  const mesActual = document.createElement('span');
  mesActual.id = 'mes-actual';
  mesActual.textContent = firstDay.toLocaleString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase();
  mesActual.style.fontWeight = 'bold';

  header.appendChild(prevBtn);
  header.appendChild(mesActual);
  header.appendChild(nextBtn);

  const consignaDiv = document.getElementById('consigna-mensual') || document.createElement('div');
  consignaDiv.id = 'consigna-mensual';
  consignaDiv.style.textAlign = 'center';
  consignaDiv.style.fontSize = '1rem';
  consignaDiv.style.marginBottom = '1rem';
  if (!document.getElementById('consigna-mensual')) {
    header.appendChild(consignaDiv);
  }

  const consigna = consignas.find(c => c.anio === year && c.mes === (month + 1));
  consignaDiv.textContent = consigna ? consigna.texto : '';

  let hayEventos = false;

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
      const hasta = e.hasta instanceof Date && !isNaN(e.hasta) ? e.hasta : null;

      if (e.repeat === 'semanal') {
        return eventDate.getUTCDay() === dateObj.getUTCDay() && dateObj >= eventDate && (!hasta || dateObj <= hasta);
      }
      if (e.repeat === 'anual') {
        const sameDayAndMonth = eventDate.getUTCDate() === dateObj.getUTCDate() && eventDate.getUTCMonth() === dateObj.getUTCMonth();
        return sameDayAndMonth && (!hasta || dateObj <= hasta);
      }
      return e.date === cellDate;
    });

    if (dayEvents.length > 0) hayEventos = true;

    dayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.classList.add('event');

      const tipo = event.type;
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
        eventEl.textContent = `🎂 ${event.title}${event.edad !== null ? ` (${event.edad})` : ''}`;
      } else if (tipo === 'aniversario') {
        const yearStart = new Date(event.rawDate).getFullYear();
        const currentYear = dateObj.getUTCFullYear();
        const years = currentYear - yearStart;
        eventEl.textContent = `${event.title} (${years} años)`;
        eventEl.style.fontWeight = 'bold';
      } else {
        eventEl.textContent = `${event.time ? event.time + ' ' : ''}${event.title}`;
      }

      dayCell.appendChild(eventEl);
    });

    calendar.appendChild(dayCell);
  }

  if (!hayEventos) {
    const aviso = document.createElement('div');
    aviso.style.textAlign = 'center';
    aviso.style.margin = '1rem';
    aviso.style.color = '#999';
    aviso.textContent = 'No hay eventos en este mes';
    calendar.appendChild(aviso);
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
