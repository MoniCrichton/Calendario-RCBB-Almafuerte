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
