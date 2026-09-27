# ecoulima-admin — Panel Administrativo

Panel de administración en React + Vite, conectado al backend real (`Proyecto_Soft_back`).

## 1. Instalación

```bash
cd ecoulima-admin
npm install
```

## 2. Configura la URL del backend

Copia `.env.example` a `.env`:

```bash
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux
```

Por defecto apunta a `http://localhost:3000`, que es donde corre el backend en desarrollo.

## 3. Levanta el backend primero

Sigue el README del backend (`back/README.md`): instala dependencias, crea la base de
datos, corre `npm run migrate` y `npm run seed`, y déjalo corriendo con `npm run dev`.

## 4. Levanta el panel admin

```bash
npm run dev
```

Abre `http://localhost:5173` e inicia sesión con el usuario admin de ejemplo (creado por
`npm run seed` en el backend):

- **Código:** `admin`
- **Contraseña:** `admin1234`

## Qué cambió respecto a la versión anterior

- Antes solo el login llamaba al backend real; el Dashboard, Usuarios, Rankings y Premios
  usaban datos simulados en memoria (`src/data/mockData.js`) que se perdían al recargar.
- Ahora **todas las páginas obtienen y guardan datos reales** a través de `src/lib/api.js`:
  el dashboard trae sus métricas ya calculadas por el backend, Usuarios consulta el detalle
  real de cada estudiante, Premios hace create/update/delete/toggle contra la base de datos,
  y Rankings se refresca periódicamente desde el backend en vez de simular puntos aleatorios
  en el navegador.
- El login ahora guarda el token JWT que emite el backend y lo envía en cada petición
  protegida (`Authorization: Bearer <token>`); se limpia automáticamente al cerrar sesión.
