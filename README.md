# 📆 Calendario Rotary Club Bahía Blanca Almafuerte

Este proyecto es una herramienta digital para visualizar y gestionar de manera organizada los eventos del Rotary Club Bahía Blanca Almafuerte, con integración en tiempo real con Google Sheets y enfoque en la accesibilidad desde dispositivos móviles y de escritorio.

---

## 🎯 Objetivo

Brindar una visualización clara, moderna y accesible del calendario del club, permitiendo a socios y visitantes consultar rápidamente cumpleaños, reuniones, actividades especiales, feriados, y más.

---

## 🧩 Funcionalidades principales

- ✅ Visualización mensual de eventos (cuadrícula de lunes a domingo).
- ✅ Clasificación de eventos (cumpleaños, feriados, cenas, reuniones, etc.).
- ✅ Colores distintivos por tipo de evento.
- ✅ Repetición semanal, anual o con fecha de fin.
- ✅ Cálculo automático de edad para cumpleaños.
- ✅ Consigna mensual visible arriba del calendario.
- ✅ Día actual resaltado (visual y scroll automático en celulares).
- ✅ Integración con Google Sheets (evento sugerido → hoja Eventos Sugeridos).
- ✅ Formulario público para sugerir eventos, con validación.

---

## 🛠️ Tecnologías utilizadas

| Tecnología       | Uso principal                              |
|------------------|---------------------------------------------|
| HTML / CSS       | Estructura y diseño responsivo              |
| JavaScript       | Lógica del calendario y carga dinámica      |
| Google Sheets API + Apps Script | Backend de eventos, sugerencias y consignas |
| Netlify          | Hosting del sitio web                       |
| Git + GitHub     | Control de versiones y despliegue continuo  |
| OpenSheet (opensheet.vercel.app) | Lectura pública de hojas de cálculo |

---

## 📁 Estructura de archivos

```
📦 Calendario-RCBB-Almafuerte
├── index.html               # Página principal del calendario
├── styles.css               # Estilos generales y responsivos
├── script.js                # Lógica principal de generación y carga del calendario
├── agregar-evento.html      # Página del formulario público
├── agregar-evento.js        # Envío de eventos sugeridos a Google Sheets
└── README.md                # Descripción del proyecto
```

---

## 🚀 ¿Cómo se publica en producción?

1. Se trabaja en la rama `dev` para realizar cambios y pruebas.
2. Cuando está listo, se hace un merge a `main` (rama de producción).
3. Netlify detecta los cambios en `main` y publica automáticamente el sitio.

---

## 📱 Acceso y uso

- El calendario se puede visualizar desde computadoras, tablets y celulares.
- En celulares, la vista es de 2 columnas y el calendario hace scroll automáticamente al día actual.
- El formulario público permite sugerir eventos de manera sencilla y rápida.

---

## ✨ Créditos y agradecimientos

Este calendario fue desarrollado con amor y dedicación para el **Rotary Club Bahía Blanca Almafuerte**, con el objetivo de facilitar la comunicación interna y fortalecer el vínculo con la comunidad.

> Hecho con 💙 por [Monica Crichton](https://github.com/MoniCrichton)  
> Proyecto sin fines de lucro, abierto y ampliable para otros clubes o instituciones.

---

## 📝 Licencia

Este proyecto es de uso libre para fines educativos, institucionales o comunitarios.  
Si querés adaptarlo para tu organización, ¡adelante! 🙌
