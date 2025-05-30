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

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('enviadoPor');
  const inputOtro = document.getElementById('enviadoPorOtro');
  const form = document.getElementById('eventoForm');
  const mensaje = document.getElementById('mensajeEnvio');

  if (select && inputOtro) {
    select.addEventListener('change', () => {
      inputOtro.style.display = select.value === 'otro' ? 'block' : 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      mensaje.textContent = "⏳ Enviando evento...";
      mensaje.style.color = "black";

      const data = {
        titulo: form.titulo.value.trim(),
        fecha: form.fecha.value,
        hora: form.hora.value,
        tipo: form.tipo.value,
        repetir: form.repetir.value,
        enviadoPor: form.enviadoPor.value === 'otro'
          ? form.enviadoPorOtro.value.trim()
          : form.enviadoPor.value,
        comentarios: form.comentarios.value.trim()
      };

      fetch('http://localhost:3000/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          mensaje.textContent = "✅ Evento enviado correctamente.";
          mensaje.style.color = "green";
          form.reset();
          inputOtro.style.display = 'none';
        } else {
          mensaje.textContent = "❌ Error al enviar el evento.";
          mensaje.style.color = "red";
        }

        setTimeout(() => mensaje.textContent = "", 5000);
      })
      .catch(error => {
        console.error("Error de red:", error);
        mensaje.textContent = "❌ No se pudo conectar con el servidor.";
        mensaje.style.color = "red";

        setTimeout(() => mensaje.textContent = "", 5000);
      });
    });
  }
});
