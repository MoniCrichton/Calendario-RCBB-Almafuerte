// agregar-evento.js

const form = document.getElementById('evento-form');
const selectSocios = document.getElementById('enviado-por');
const otroNombreLabel = document.getElementById('otro-nombre-label');
const otroNombreInput = document.getElementById('otro-nombre');
const mensajeExito = document.getElementById('mensaje-exito');

// Cargar lista de socios desde hoja "Socios"
fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Socios")
  .then(res => res.json())
  .then(data => {
    data.forEach(row => {
      const nombre = `${row.Nombre} ${row.Apellido}`.trim();
      const option = document.createElement('option');
      option.value = nombre;
      option.textContent = nombre;
      selectSocios.appendChild(option);
    });
    const otro = document.createElement('option');
    otro.value = 'Otro';
    otro.textContent = 'Otro';
    selectSocios.appendChild(otro);
  });

// Mostrar campo manual si se elige "Otro"
selectSocios.addEventListener('change', () => {
  otroNombreLabel.style.display = selectSocios.value === 'Otro' ? 'block' : 'none';
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Si eligió "Otro", usar ese valor
  const enviadoPor = data.enviadoPor === 'Otro' ? data.otroNombre : data.enviadoPor;

  const payload = {
    Titulo: data.titulo,
    Fecha: data.fecha,
    "Hora Inicio": data.hora,
    Tipo: data.tipo,
    Repetir: data.repetir,
    "Enviado por": enviadoPor,
    Comentarios: data.comentarios
  };

  fetch("https://script.google.com/macros/s/AKfycbzenkAI7Y6OfySx10hnpkaHfgXLshZYMhTt3L84SAmS5hr3UXBcvDZewPOD-donpORP/exec", {
    method: 'POST',
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (res.ok) {
        form.reset();
        mensajeExito.style.display = 'block';
        setTimeout(() => mensajeExito.style.display = 'none', 3000);
      } else {
        alert('Hubo un error al enviar el evento.');
      }
    })
    .catch(() => alert('Error de conexión al enviar el evento.'));
});
