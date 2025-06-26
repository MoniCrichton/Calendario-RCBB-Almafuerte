export default async function handler(req, res) {
  const respuesta = await fetch('https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec');
  const data = await respuesta.json();
  res.status(200).json(data);
}
