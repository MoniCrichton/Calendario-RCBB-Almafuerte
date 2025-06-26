export default async function handler(req, res) {
  try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec');
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }

    const data = await response.json();

    if (!data.tipos) {
      return res.status(404).json({ error: 'No se encontraron tipos' });
    }

    res.status(200).json({ tipos: data.tipos });

  } catch (error) {
    console.error('❌ Error en /api/obtenerTipos:', error);
    res.status(500).json({ error: 'Error al obtener tipos' });
  }
}
