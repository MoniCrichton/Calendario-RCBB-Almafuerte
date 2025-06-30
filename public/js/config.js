// config.js

// Detectar entorno de desarrollo de forma más confiable
const isDev = window.location.href.includes("-dev");

// Apps Script para formularios
const devScriptURL = "https://script.google.com/macros/s/AKfycbwUfUOsRXavh1G_rPeu-8jXmgoTOAp7KW43uX0jIjZlUFvTYivMz5gH5lPUhV_l1Y6JGA/exec";
const prodScriptURL = "https://script.google.com/macros/s/AKfycbz4IwyrKpNxD-fq3lt5M1E-hNMVovV3Raq58nQ67EyYO6ub8gHyo2FbOnX7DOUcN5wG/exec";

// Google Sheets públicos (opensheet)
const devSheetID = "1Ty-lWJzlqHn745hjeKcET2W-rgKBujCa";
const prodSheetID = "1S7ZFwciFjQ11oScRN9cA9xVVtuZUR-HWmMVO3HWAkg4";

const sheetID = isDev ? devSheetID : prodSheetID;

// Construir URLs
const SHEET_BASE = `https://opensheet.vercel.app/${sheetID}`;

window.ENDPOINT_URL = isDev ? devScriptURL : prodScriptURL;
window.URL_EMOJIS = `${SHEET_BASE}/Emojis`;
window.URL_CONSIGNAS = `${SHEET_BASE}/Consignas`;
window.URL_CUMPLES = `${SHEET_BASE}/Cumples`;
window.URL_FERIADOS = `${SHEET_BASE}/Feriados`;

console.log("🌎 Modo:", isDev ? "DEV" : "PRODUCCIÓN");
console.log("📄 Usando hoja:", window.URL_CONSIGNAS);
