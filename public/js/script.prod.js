fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Consignas")
  .then(res => res.json())
  .then(data => console.log("✅ PROD: Consignas", data));

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Feriados")
  .then(res => res.json())
  .then(data => console.log("✅ PROD: Feriados", data));

fetch("https://opensheet.vercel.app/1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4/Cumples")
  .then(res => res.json())
  .then(data => console.log("✅ PROD: Cumples", data));

fetch("https://script.google.com/macros/s/AKfycbz4IwyrKpNxD-fq3lt5M1E-hNMVovV3Raq58nQ67EyYO6ub8gHyo2FbOnX7DOUcN5wG/exec")
  .then(res => res.json())
  .then(data => console.log("✅ PROD: Eventos", data));
