# VCC50000 + Asesor Principal.ai

Este proyecto agrega un botón rojo con letras blancas llamado **Asesor Principal.ai** e invoca el prompt creado en OpenAI:

```txt
pmpt_6a0bba6d1fd4819786666591bafceb9e08591b2d4759ba51
```

## Por qué fallaba en GitHub Pages

GitHub Pages solo publica archivos estáticos: `index.html`, `app.js`, `styles.css`, etc. No ejecuta `server.js`, no lee `.env` y no puede crear rutas como `/api/asesor-principal`.

El error `Unexpected token '<', '<html>...' is not valid JSON` significa que el frontend pidió `/api/asesor-principal`, pero GitHub Pages devolvió una página HTML de error en vez de una respuesta JSON.

## Estructura

- `index.html`: página principal con el botón rojo **Asesor Principal.ai** y el modal del asesor.
- `styles.css`: estilos del botón rojo, modal y chat.
- `app.js`: lógica del frontend. Usa `config.js` para saber dónde está el backend.
- `config.js`: URL pública del backend cuando usas GitHub Pages.
- `server.js`: backend Node/Express que llama a OpenAI con `openai.responses.create`.
- `.env.example`: plantilla para configurar la API key.

## Opción A: correr todo localmente

```bash
npm install
cp .env.example .env
npm start
```

Abre:

```txt
http://localhost:3000
```

En `.env` configura:

```env
OPENAI_API_KEY=sk-proj_tu_api_key_real
OPENAI_PRINCIPAL_PROMPT_ID=pmpt_6a0bba6d1fd4819786666591bafceb9e08591b2d4759ba51
OPENAI_PRINCIPAL_PROMPT_VERSION=1
PORT=3000
CORS_ORIGIN=*
```

## Opción B: GitHub Pages + backend externo

Para que funcione en `https://vcc5000000.github.io/...`, debes publicar `server.js` en un hosting que sí ejecute Node, por ejemplo Render, Railway, Vercel, VPS, etc.

Cuando tengas la URL pública del backend, edita `config.js`:

```js
window.VCC50000_ASESOR_API_URL = "https://TU-BACKEND.onrender.com/api/asesor-principal";
```

Luego sube a GitHub Pages estos archivos públicos:

```txt
index.html
styles.css
app.js
config.js
```

Y sube al backend estos archivos:

```txt
server.js
package.json
.env
```

## Seguridad

No coloques `OPENAI_API_KEY` en `index.html`, `app.js`, `config.js` ni en ningún archivo público. La clave solo debe vivir en `.env` en el servidor.
