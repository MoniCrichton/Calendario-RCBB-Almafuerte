
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

function obtenerGrupoDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("grupo")?.toLowerCase() || "todos";
}

function intentarGenerarCalendario() {
  if (Object.values(datosListos).every(v => v)) {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }
}

fetch(`${window.ENDPOINT_URL}?ruta=obtenerTipos`)
  .then(res => res.json())
  .then(data => {
    emojis = data.tipos.reduce((acc, row) => {
      const tipo = (row.tipo || '').trim().toLowerCase();
      const emoji = (row.emoji || '').trim();
      const color = (row.color || '').trim();
      const explicacion = (row.explicacion || '').trim();
      if (tipo) {
        acc[tipo] = {
          emoji: emoji,
          color: color || '#e2e3e5',
          explicacion
        };
      }
      return acc;
    }, {});
    datosListos.emojis = true;
    intentarGenerarCalendario();
  })
  .catch(() => {
    console.warn("❌ Falló cargar emojis");
    datosListos.emojis = true;
    intentarGenerarCalendario();
  });

fetch(window.URL_CONSIGNAS)
  .then(res => res.json())
  .then(data => {
    consignas = data.map(row => ({
      anio: parseInt(row.Año),
      mes: parseInt(row.Mes),
      texto: row.Consigna
    }));
    datosListos.consignas = true;
    intentarGenerarCalendario();
  })
  .catch(() => {
    console.warn("❌ Falló cargar consignas");
    datosListos.consignas = true;
    intentarGenerarCalendario();
  });

fetch(`${window.ENDPOINT_URL}`)
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
  })
  .catch(() => {
    console.warn("❌ Falló cargar cumpleaños");
    datosListos.cumpleaños = true;
    intentarGenerarCalendario();
  });

fetch(window.URL_FERIADOS)
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
  })
  .catch(() => {
    console.warn("❌ Falló cargar feriados");
    datosListos.feriados = true;
    intentarGenerarCalendario();
  });

fetch(`${window.ENDPOINT_URL}`)
  .then(res => res.json())
  .then(data => {
    const grupo = obtenerGrupoDesdeURL();
    const procesados = data.map(row => {
      const fecha = new Date(row.Fecha);
      const hasta = row.Hasta ? new Date(row.Hasta) : null;
      const esFechaValida = !isNaN(fecha);
      const mostrarKey = Object.keys(row).find(key => key.trim().toUpperCase() === 'MOSTRAR');
      const mostrarRaw = mostrarKey ? row[mostrarKey].trim() : '';
      const mostrar = mostrarRaw.toUpperCase() !== 'NO';

      return {
        date: esFechaValida ? fecha.toISOString().split('T')[0] : null,
        rawDate: row.Fecha || '',
        title: (row.Titulo || '').trim() || 'Sin título',
        time: row['Hora Inicio'] ? row['Hora Inicio'].trim() : '',
        type: (row.Tipo || 'otro').trim().toLowerCase(),
        repeat: (row.Repetir || '').trim().toLowerCase(),
        hasta: hasta,
        error: !esFechaValida,
        mostrar: mostrar,
        mostrarGrupo: mostrarRaw
      };
    });

    const visibles = procesados.filter(e => {
      if (!e.mostrar) return false;
      if (grupo === 'ver_todo') return true;
      const gruposPermitidos = String(e.mostrarGrupo || '').toLowerCase().split(',').map(g => g.trim());
      return gruposPermitidos.includes("todos") || gruposPermitidos.includes(grupo);
    });

    events = [...cumpleaños, ...feriados, ...visibles];
    datosListos.eventos = true;
    intentarGenerarCalendario();
  })
  .catch(() => {
    console.warn("❌ Falló cargar eventos");
    datosListos.eventos = true;
    intentarGenerarCalendario();
  });

function generateCalendar(year, month) {
  // función original que renderiza el calendario
  // Moni ya la tiene completa, y debería copiarla directamente donde estaba
  console.log("✅ generateCalendar ejecutado con", year, month);
}

function cambiarMes(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.error("❌ Error al registrar el SW", err));
}
