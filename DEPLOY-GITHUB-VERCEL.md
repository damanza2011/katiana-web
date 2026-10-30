# Guía de Despliegue · KATIANA Droguería Online

Este proyecto está 100% preparado para desplegarse tanto en **GitHub Pages** como en **Vercel**.

---

## 1. Probar en Local

Puedes probar la droguería de inmediato en tu equipo:

### Opción A (Un clic):
Haz doble clic sobre el archivo `start-demo.cmd`. Se iniciará el servidor y se abrirá en `http://127.0.0.1:8095/`.

### Opción B (PowerShell / Terminal):
```powershell
cd C:\Users\dan\Desktop\katiana-web
python -m http.server 8095
```
Abre en tu navegador: `http://127.0.0.1:8095/`.

---

## 2. Repositorio en GitHub

El repositorio ya ha sido creado e inicializado en tu GitHub:
**https://github.com/damanza2011/katiana-web**

Para verificar o hacer nuevos commits:
```powershell
cd C:\Users\dan\Desktop\katiana-web
git add .
git commit -m "KATIANA farmacia v1"
git push origin main
```

---

## 3. Despliegue en GitHub Pages (Gratis y Automático)

1. Ingresa a tu repositorio: [https://github.com/damanza2011/katiana-web](https://github.com/damanza2011/katiana-web).
2. Ve a la pestaña **Settings** (Configuración) -> **Pages** (en el menú izquierdo).
3. En **Build and deployment -> Source**, selecciona **GitHub Actions** (ya incluye el workflow automático en `.github/workflows/deploy.yml`) o selecciona **Deploy from a branch** -> rama `main` -> `/ (root)`.
4. Haz clic en **Save**. En 1 o 2 minutos tu sitio estará en vivo en:
   `https://damanza2011.github.io/katiana-web/`

---

## 4. Despliegue en Vercel (Con Soporte Serverless para Gemini)

1. Ingresa a [vercel.com/new](https://vercel.com/new).
2. Conecta tu cuenta de GitHub e importa el repositorio `katiana-web`.
3. Configuración del proyecto:
   - **Framework Preset:** `Other`.
   - **Root Directory:** `./`.
   - **Build Command:** (dejar vacío).
   - **Output Directory:** (dejar vacío).
4. En **Environment Variables**, añade:
   - `GEMINI_API_KEY`: tu clave de Google AI Studio.
   - `GEMINI_MODEL`: `gemini-2.5-flash`.
5. Haz clic en **Deploy**.
