document.getElementById("eventoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    "Titulo": form.titulo.value,
    "Fecha": form.fecha.value,
    "Hora Inicio": form.hora.value,
    "Tipo": form.tipo.value,
    "Repetir": form.repetir.value,
    "Enviado por": form.enviado.value === "otro" ? form.otroEnviado.value : form.enviado.value,
    "Comentarios": form.comentarios.value
  };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbz4IwyrKpNxD-fq3lt5M1E-hNMVovV3Raq58nQ67EyYO6ub8gHyo2FbOnX7DOUcN5wG/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      alert("✅ Evento enviado con éxito.");
      form.reset();
      document.getElementById("otroEnviado").style.display = "none";
    } else {
      alert("❌ Error al enviar el evento.");
    }
  } catch (error) {
    console.error("Error al enviar:", error);
    alert("⚠️ Hubo un error inesperado.");
  }
});

// Mostrar campo "otro" cuando se selecciona "otro"
document.getElementById("enviado").addEventListener("change", function () {
  const otro = document.getElementById("otroEnviado");
  otro.style.display = this.value === "otro" ? "block" : "none";
});
