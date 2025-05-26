// Cargar lista de socios
fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Socios")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('enviadoPor');
    if (!select) return;

    const socios = data.map(row => `${row.Nombre} ${row.Apellido}`);
    socios.sort((a, b) => a.localeCompare(b, 'es'));

    socios.forEach(nombreCompleto => {
      const option = document.createElement('option');
      option.value = nombreCompleto;
      option.textContent = nombreCompleto;
      select.appendChild(option);
    });
  });

// Mostrar campo "Otro"
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('enviadoPor');
  const inputOtro = document.getElementById('enviadoPorOtro');

  if (select && inputOtro) {
    select.addEventListener('change', () => {
      inputOtro.style.display = select.value === 'otro' ? 'block' : 'none';
    });
  }

  // Enviar formulario
  const form = document.getElementById('eventoForm');
  const mensaje = document.getElementById('mensajeEnvio');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      titulo: form.titulo.value.trim(),
      fecha: form.fecha.value,
      hora: form.hora.value,
      tipo: form.tipo.value,
      repetir: form.repetir.value,
      enviadoPor: form.enviadoPor.value === 'otro' ? form.enviadoPorOtro.value.trim() : form.enviadoPor.value,
      comentarios: form.comentarios.value.trim()
        };

    fetch('https://script.google.com/macros/s/AKfycbyMm7Cb4gKHmVXYdPd2ZoLPkubuDwJ-DjQQcrLHgNt0x8iO2YEzaSp-Gl2as-Zloh2m_g/exec', {
      method: 'POST',
      mode: 'no-cors',  // <-- Agregalo acá 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });



    mensaje.textContent = "✅ Evento enviado correctamente. Puede tardar unos segundos en reflejarse.";
    form.reset();
    document.getElementById('enviadoPorOtro').style.display = 'none';
  });
});
