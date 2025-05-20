# Calendario RCBB Almafuerte

Este proyecto es un calendario interactivo desarrollado para el Rotary Club Bahía Blanca Almafuerte. Permite visualizar cumpleaños, feriados, eventos recurrentes y otros tipos de actividades directamente desde Google Sheets.

---

## ✅ Funcionalidades implementadas

- **Visualización mensual del calendario** con datos desde distintas hojas:
  - `Eventos principales`
  - `Cumpleaños`
  - `Feriados`
  - `Consignas mensuales`

- **Eventos recurrentes**:
  - Soporte para eventos **anuales**, **semanales** y con fecha de fin.

- **Edad automática** en cumpleaños y aniversarios.

- **Colores diferenciados y emojis** según el tipo de evento (definido en hoja `Emojis`).

- **Formulario público** para sugerir eventos:
  - Envío directo a la hoja `Eventos Sugeridos`
  - Campos: Título, Fecha, Hora, Tipo, Repetición, Enviado por, Comentarios

- **Adaptabilidad responsive**:
  - Calendario en grilla de 7 columnas en computadoras
  - Vista en dos columnas en celulares

- **Día actual resaltado** con borde y fondo especial
  - En celulares se desplaza automáticamente hasta el día actual

- **Encabezado con logo de Rotary** y consigna mensual cargada desde la hoja `Consignas`

- **Footer personalizado**:
  > Sitio creado por Monica Crichton (Moni) para RC Bahía Blanca Almafuerte.  
  > Inspirado en los valores de Rotary International.

---

## 🧩 Tecnologías utilizadas

- **HTML/CSS/JavaScript Vanilla** (sin frameworks)
- **Google Sheets API (via opensheet.vercel.app)**
- **Google Apps Script** para el formulario
- **Netlify** para despliegue

---

## 📌 Cómo colaborar o sugerir eventos

1. Visitar [el formulario de agregar evento](./agregar-evento.html)
2. Completar los datos requeridos
3. El evento se guardará en la hoja `Eventos Sugeridos` para revisión

---

## 🔜 Próximas mejoras

- Panel de administración para aceptar o rechazar sugerencias
- Colores definidos desde la hoja `Tipos` para que se reflejen automáticamente en pantalla
- Exportación o impresión del calendario mensual

---

## 📅 Ejemplo en producción

Puedes ver el calendario en funcionamiento aquí:  
👉 [calendariorcbb-dev.netlify.app](https://calendariorcbb-dev.netlify.app)

---

_Gracias por apoyar el servicio comunitario de RC Bahía Blanca Almafuerte._

#fffce5 (amarillo pastel) o #fdf6e3 (bei