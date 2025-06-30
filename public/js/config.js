// config.js

// Obtener el hostname de la URL actual
const hostname = window.location.hostname;

// Dominio exacto de producción según Vercel
const productionDomain = 'calendario-rcbb-almafuerte-dev.vercel.app';

// Detectar si es un despliegue de preview en Vercel
const isVercelPreview = hostname.endsWith('.vercel.app') && hostname !== productionDomain;

// Apps Script para formularios
const devScriptURL = "https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec";
const prodScriptURL = "https://script.google.com/macros/s/AKfycbz4IwyrKpNxD-fq3lt5M1E-hNMVovV3Raq58nQ67EyYO6ub8gHyo2FbOnX7DOUcN5wG/exec";

// Google Sheets públicos (opensheet)
const devSheetID = "1Ty-lWJzlqHn745hjeKcET2W-rgKBujCa";
const prodSheetID = "1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4";

// Construir URLs finales
const scriptURL = isVercelPreview ? devScriptURL : prodScriptURL;
const sheetID = isVercelPreview ? devSheetID : prodSheetID;
const SHEET_BASE = `https://opensheet.vercel.app/${sheetID}`;

// Asignar a variables globales
window.ENDPOINT_URL = scriptURL;
window.URL_EMOJIS = `${SHEET_BASE}/Emojis`;
window.URL_CONSIGNAS = `${SHEET_BASE}/Consignas`;
window.URL_CUMPLES = `${SHEET_BASE}/Cumples`;
window.URL_FERIADOS = `${SHEET_BASE}/Feriados`;

// Logs para depuración
console.log("🌎 Hostname actual:", hostname);
console.log("🌍 Dominio de producción esperado:", productionDomain);
console.log("🔁 ¿Es entorno de Vercel Preview?", isVercelPreview);
console.log("🔗 Script URL:", window.ENDPOINT_URL);
console.log("📄 Sheet ID usado:", sheetID);
console.log("📑 URL Consignas:", window.URL_CONSIGNAS);

// Indicador visual en pantalla
const etiqueta = document.createElement('div');
etiqueta.textContent = isVercelPreview ? "🌱 Modo DESARROLLO" : "🚀 Modo PRODUCCIÓN";
etiqueta.style.position = "fixed";
etiqueta.style.top = "10px";
etiqueta.style.right = "10px";
etiqueta.style.padding = "6px 12px";
etiqueta.style.backgroundColor = isVercelPreview ? "#e0f7e9" : "#e6f2ff";
etiqueta.style.color = "#000";
etiqueta.style.borderRadius = "8px";
etiqueta.style.fontWeight = "bold";
etiqueta.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
etiqueta.style.zIndex = "1000";
document.body.appendChild(etiqueta);
