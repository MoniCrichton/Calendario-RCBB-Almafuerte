export default async function handler(req, res) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SCRIPT_URL;

    const response = await fetch(`${baseUrl}?ruta=obtenerSocios`);

    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }

    const data = await response.json();

    if (!data.socios) {
      return res.status(404).json({ error: 'No se encontraron socios' });
    }

    res.status(200).json({ socios: data.socios });
  } catch (error) {
    console.error('❌ Error en /api/obtenerSocios:', error);
    res.status(500).json({ error: 'Error al obtener socios' });
  }
}
