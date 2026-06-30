# MERN Academy

Proyecto MERN para compartir con compañeros. Incluye notas colaborativas, algoritmos y taller Oracle 26ai.

## Inicio rápido con Docker (recomendado)

Solo necesitas tener instalado [Docker Desktop](https://www.docker.com/).

```bash
# Clonar o descargar el proyecto
cd proyectoMERN

# Levantar todo (MongoDB + backend + frontend)
docker compose up --build -d
```

Abre **http://localhost:3000** en el navegador.

### Comandos útiles

```bash
docker compose up --build -d   # Iniciar en segundo plano
docker compose down            # Detener y quitar contenedores
docker compose logs -f         # Ver logs en vivo
docker compose ps              # Ver estado de los servicios
```

También puedes usar los scripts npm:

```bash
npm start    # docker compose up --build -d
npm stop     # docker compose down
npm run logs # ver logs
```

## Funcionalidades

### Notas
Crear, listar y eliminar notas compartidas entre compañeros.

### Algoritmos y Estructuras de Datos
12 lecciones con teoría, ejemplos en JavaScript y ejercicios.

### Taller Oracle 26ai (64 horas)
25 ejercicios SQL alineados al temario del curso (DDL, DML, control de acceso, concurrencia, PL/SQL, conectividad).

## Arquitectura Docker

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│   MongoDB   │
│  nginx :80  │     │  Node :5000 │     │    :27017   │
│ expuesto    │     │  (interno)  │     │  (interno)  │
│  :3000      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

- El frontend (nginx) sirve React y redirige `/api` al backend.
- MongoDB y el backend solo existen dentro de la red Docker.
- Los datos de MongoDB persisten en el volumen `mongo_data`.

## Desarrollo local (sin Docker completo)

Si prefieres desarrollar con hot-reload:

**Requisitos:** Node.js 18+, MongoDB (Docker o local)

```bash
npm install
npm run install:all
cp backend/.env.example backend/.env
npm run mongo          # solo MongoDB en Docker
npm run dev            # backend + frontend con recarga automática
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del API |
| GET | `/api/notas` | Listar notas |
| POST | `/api/notas` | Crear nota |
| DELETE | `/api/notas/:id` | Eliminar nota |
| GET | `/api/lecciones` | Listar lecciones |
| GET | `/api/lecciones/:id` | Ver lección |
| GET | `/api/oracle/temario` | Temario del taller |
| GET | `/api/oracle` | Listar ejercicios Oracle |
| GET | `/api/oracle/:id` | Ver ejercicio |

## Estructura del proyecto

```
proyectoMERN/
├── backend/
│   ├── Dockerfile
│   ├── models/
│   ├── routes/
│   ├── data/
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
└── README.md
```

## Notas para compañeros

| Necesitas | Para qué |
|-----------|----------|
| **Docker Desktop** | Correr todo el proyecto |
| **Navegador** | Usar la app en localhost:3000 |
| **Oracle 26ai** (opcional) | Solo si quieres ejecutar los scripts SQL del módulo Oracle |

No hace falta instalar Node.js ni MongoDB si usas Docker.

## Solución de problemas

| Problema | Solución |
|----------|----------|
| Puerto 3000 ocupado | Cambia `3000:80` por `8080:80` en `docker-compose.yml` |
| La app no carga datos | `docker compose logs backend` y espera a que MongoDB esté listo |
| Cambios en código no se ven | `docker compose up --build -d` para reconstruir imágenes |
| Empezar de cero | `docker compose down -v` (borra datos de MongoDB) |
