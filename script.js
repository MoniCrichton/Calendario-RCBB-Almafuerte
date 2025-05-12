// script.js
let events = [];
let consignas = [];
let cumpleaños = [];
let feriados = [];
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
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Consignas")
  .then(res => res.json())
  .then(data => {
    consignas = data.map(row => ({
      anio: parseInt(row.Año),
      mes: parseInt(row.Mes),
      texto: row.Consigna
    }));
  });

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Cumpleaños")
  .then(res => res.json())
  .then(data => {
    cumpleaños = data.map(row => {
      const fecha = new Date(row.Fecha);
      const esFechaValida = !isNaN(fecha);
      const mostrarEdad = (row.MostrarEdad || '').trim().toUpperCase() === 'S';

      let edad = null;
      if (esFechaValida && mostrarEdad) {
        const añoCumple = fecha.getFullYear();
        const hoy = new Date();
        const proximoCumple = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate());
        edad = hoy.getFullYear() - añoCumple;
        if (proximoCumple > hoy) edad++;
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
        title: (row.Conmemoracion || '').trim() || 'Feriado',
        time: '',
        type: 'feriado',
        repeat: 'anual',
        hasta: null,
        error: !esFechaValida,
        feriadoTipo: (row.Tipo || '').trim()
      };
    });
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
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });
