fetch("https://opensheet.vercel.app/1Ty-lWJzlqHn745hjeKcET2W-rgKBujCa/Consignas")
  .then(res => res.json())
  .then(data => console.log("✅ DEV: Consignas", data));

fetch("https://opensheet.vercel.app/1Ty-lWJzlqHn745hjeKcET2W-rgKBujCa/Feriados")
  .then(res => res.json())
  .then(data => console.log("✅ DEV: Feriados", data));

fetch("https://opensheet.vercel.app/1Ty-lWJzlqHn745hjeKcET2W-rgKBujCa/Cumples")
  .then(res => res.json())
  .then(data => console.log("✅ DEV: Cumples", data));

fetch("https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec")
  .then(res => res.json())
  .then(data => console.log("✅ DEV: Eventos", data));
