// config.js

// Obtener el hostname de la URL actual
const hostname = window.location.hostname;

// Definir tu dominio de producción exactamente como aparece en Vercel
// Según tu captura, es 'calendario-rcbb-almafuerte-dev.vercel.app'
const productionDomain = 'calendario-rcbb-almafuerte-dev.vercel.app';

// Detectar si estamos en un entorno de "preview" de Vercel
// Esto será true si el hostname NO es el dominio de producción
// y SÍ termina en '.vercel.app' (lo que indica que es un despliegue de Vercel)
const isVercelPreview = hostname.endsWith('.vercel.app') && hostname !== productionDomain;

// Apps Script para formularios
const devScriptURL = "https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec";
const prodScriptURL = "https://script.google.com/macros/s/AKfycbz4IwyrKpNxD-fq3lt5M1E-hNMVovV3Raq58Q67EyYO6ub8gHyo2FbOnX7DOUcN5wG/exec"; // Asegúrate de que esta es la URL de PROD real

// Google Sheets públicos (opensheet)
const devSheetID = "1Ty-lWJzlqHn745hjeKcET2W-rgKBujCa";
const prodSheetID = "1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4"; // Asegúrate de que esta es la ID de PROD real

// Usar la lógica de detección para elegir las URLs/IDs
const scriptURL = isVercelPreview ? devScriptURL : prodScriptURL;
const sheetID = isVercelPreview ? devSheetID : prodSheetID;

// Construir URLs
const SHEET_BASE = `https://opensheet.vercel.app/${sheetID}`;

window.ENDPOINT_URL = scriptURL;
window.URL_EMOJIS = `${SHEET_BASE}/Emojis`;
window.URL_CONSIGNAS = `${SHEET_BASE}/Consignas`;
window.URL_CUMPLES = `${SHEET_BASE}/Cumples`;
window.URL_FERIADOS = `${SHEET_BASE}/Feriados`;

// Registro para depuración
console.log("🌎 Hostname actual:", hostname);
console.log("🌎 Dominio de producción esperado:", productionDomain);
console.log("🌎 ¿Es Vercel Preview (DEV)?", isVercelPreview);
console.log("📄 Usando script URL:", window.ENDPOINT_URL);
console.log("📄 Usando hoja ID:", sheetID);
console.log("📄 Usando URL Consignas:", window.URL_CONSIGNAS);