export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sólo se permiten solicitudes POST' });
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const texto = await response.text();
    res.status(200).json({ mensaje: texto });
  } catch (error) {
    console.error('Error al reenviar al Apps Script:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
