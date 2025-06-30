// /pages/api/enviarEventos.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sólo se permiten solicitudes POST' });
  }

  try {
    const scriptUrl = process.env.NEXT_PUBLIC_SCRIPT_URL;

    if (!scriptUrl) {
      return res.status(500).json({ error: 'La URL del Apps Script no está definida en las variables de entorno' });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const texto = await response.text();
    const resultado = JSON.parse(texto);
    res.status(200).json(resultado);


  } catch (error) {
    console.error('Error al reenviar al Apps Script:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
