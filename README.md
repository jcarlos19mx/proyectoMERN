# MERN Notas

Proyecto MERN simple para compartir con compañeros. Permite crear, listar y eliminar notas.

## Stack

- **M**ongoDB — Base de datos
- **E**xpress — API REST
- **R**eact — Interfaz de usuario (Vite)
- **N**ode.js — Servidor backend

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) (opcional, para MongoDB)

## Instalación rápida

```bash
# 1. Clonar o descargar el proyecto
cd proyectoMERN

# 2. Instalar dependencias
npm install
npm run install:all

# 3. Configurar variables de entorno del backend
cp backend/.env.example backend/.env

# 4. Levantar MongoDB con Docker
npm run mongo

# 5. Iniciar backend y frontend a la vez
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Ejecutar por separado

```bash
# Terminal 1 — MongoDB
docker compose up -d

# Terminal 2 — Backend (puerto 5000)
cd backend && npm run dev

# Terminal 3 — Frontend (puerto 3000)
cd frontend && npm run dev
```

## API

| Método | Ruta            | Descripción      |
|--------|-----------------|------------------|
| GET    | `/api/health`   | Estado del API   |
| GET    | `/api/notas`    | Listar notas     |
| POST   | `/api/notas`    | Crear nota       |
| DELETE | `/api/notas/:id`| Eliminar nota    |

### Ejemplo POST

```json
{
  "titulo": "Mi primera nota",
  "contenido": "Hola compañeros!",
  "autor": "Juan"
}
```

## Estructura del proyecto

```
proyectoMERN/
├── backend/
│   ├── models/Note.js    # Modelo Mongoose
│   ├── routes/notes.js   # Rutas CRUD
│   └── server.js         # Punto de entrada
├── frontend/
│   └── src/App.jsx       # Componente principal
├── docker-compose.yml    # MongoDB en Docker
└── README.md
```

## Sin Docker

Si tienes MongoDB instalado localmente, edita `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/mern-notas
```
