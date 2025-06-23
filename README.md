---
title: "Calendario RCBB Almafuerte"
lang: es
description: "Calendario interactivo para Rotary Club Bahía Blanca Almafuerte con integración dinámica desde Google Sheets."
author: Monica Crichton
tags: [Rotary, calendario, Google Sheets, JavaScript, comunidad]
---

# Calendario RCBB Almafuerte

Este proyecto es un calendario interactivo desarrollado para el Rotary Club Bahía Blanca Almafuerte. Permite visualizar cumpleaños, feriados, efemérides, eventos recurrentes y otras actividades directamente desde Google Sheets, con colores y emojis dinámicos según el tipo de evento.

---

## ✅ Funcionalidades implementadas

- **Visualización mensual del calendario** con datos desde distintas hojas:
  - `Eventos principales`
  - `Cumpleaños`
  - `Feriados` (incluye efemérides)
  - `Consignas mensuales`

- **Eventos recurrentes**:
  - Soporte para eventos **anuales**, **semanales**, y con fecha de fin opcional.

- **Edad automática** en cumpleaños (si se indica en la hoja).

- **Colores diferenciados y emojis** según el tipo de evento (definidos en la hoja `Emojis`).

- **Carga controlada y sincronizada**:
  - El calendario **no se genera** hasta que todos los datos están completamente cargados.
  - Esto evita errores o eventos faltantes al iniciar.

- **Formulario público** para sugerir eventos:
  - Envío directo a la hoja `Eventos Sugeridos`
  - Campos: Título, Fecha, Hora, Tipo, Repetición, Enviado por, Comentarios

- **Adaptabilidad responsive**:
  - Calendario en grilla de 7 columnas en computadoras
  - Vista en dos columnas en celulares

- **Día actual resaltado** con borde y fondo especial
  - En celulares, se hace scroll automático al día actual

- **Encabezado con logo de Rotary** y consigna mensual cargada desde la hoja `Consignas`

- **Distinción clara entre feriados y efemérides**:
  - Los feriados incluyen el prefijo **"Feriado:"** en su título.

- **Footer personalizado**:
  > Sitio creado por Monica Crichton (Moni) para RC Bahía Blanca Almafuerte.  
  > Inspirado en los valores de Rotary International.

---

## 🧩 Tecnologías utilizadas

- **HTML/CSS/JavaScript Vanilla** (sin frameworks)
- **Google Sheets API** vía [opensheet.vercel.app](https://opensheet.vercel.app)
- **Google Apps Script** para el formulario
- **Netlify** para despliegue

---

## 📌 Cómo colaborar o sugerir eventos

1. Visitar [el formulario de agregar evento](./agregar-evento.html)
2. Completar los datos requeridos
3. El evento se guardará en la hoja `Eventos Sugeridos` para su revisión

---

## 🔜 Próximas mejoras

- Panel de administración para aceptar o rechazar sugerencias
- Exportación o impresión del calendario mensual
- Botón para volver rápidamente al mes actual
- Control de duplicados o solapamientos en la vista de eventos
- Mejoras de contraste o accesibilidad en los colores

---

## 📅 Ejemplo en producción

Puedes ver el calendario en funcionamiento aquí:  
👉 [https://calendariorcbb-dev.netlify.app](https://calendariorcbb-dev.netlify.app)

---

## 🎨 Sistema de colores y emojis dinámicos

El calendario utiliza la hoja `Emojis` de Google Sheets para aplicar estilos a los eventos.

### Cómo funciona:

- Cada evento tiene un campo `type` (tipo) que se compara con los valores de la hoja `Emojis`.
- Si hay coincidencia:
  - Se agrega el **emoji** correspondiente antes del texto.
  - Se aplica el **color de fondo** definido.
- Si no hay coincidencia, se usa un color gris claro por defecto (`#e2e3e5`).

### Estructura esperada de la hoja `Emojis`:

| tipo                | emoji | color     |
|---------------------|-------|-----------|
| cumpleaños          | 🎂     | `#00FA9A` |
| reunión             | 🧑‍🤝‍🧑 | `#C1DDB3` |
| servicio            | 👏☀️   | `#F7A81B` |
| conferencia         | 🎤     | `#A6BDFE` |
| deportes y valores  | 🏋️‍♀️   | `#A7D7C5` |
| feriado             | 🏛️     | `#87CEEB` |
| efeméride           | 📌     | `#FFE9A0` |
| ryla                | 🌟     | `#FDE9D9` |
| ...                 | ...   | ...       |

> Estos valores pueden modificarse desde Google Sheets y se verán reflejados automáticamente al recargar el sitio.

### Extras visuales:

- Todos los eventos se muestran con **letra negrita** para mejorar la legibilidad.
- Los eventos se ordenan dentro de cada día según esta lógica:
  1. Cumpleaños y efemérides primero
  2. Eventos sin hora (según prioridad por tipo)
  3. Eventos con hora (en orden cronológico)

---

### Licencia

Este sistema fue creado por Mónica Crichton (Moni) para Rotary Club Bahía Blanca Almafuerte,  
inspirado en los valores de Rotary International.

Se encuentra bajo licencia [Creative Commons Reconocimiento-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).  
Esto significa que podés copiarlo, adaptarlo y compartirlo con atribución, sin fines comerciales,  
y cualquier derivado debe llevar la misma licencia.

_Gracias por apoyar el servicio comunitario de RC Bahía Blanca Almafuerte._
