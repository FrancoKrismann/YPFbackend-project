# Backend Project

Estructura base de un proyecto backend con Node.js + Express.

## Estructura de carpetas

```
YPFbackend-project/
├── database/
│   └── data.js                # Archivo JSON de datos base para los pozos
├── src/
│   ├── middlewares/
│   │   ├── auth.js            # Middleware de autenticación
│   │   └── errorHandler.js    # Manejo centralizado de errores
│   ├── models/
│   │   └── user.model.js      # Modelos de datos de la aplicación
│   ├── routes/
│   │   ├── controllers/       # Carpeta de controladores individuales
│   │   │   ├── controllerDelete.js # Lógica para eliminar pozos
│   │   │   ├── controllerGet.js    # Lógica para consultas de pozos
│   │   │   ├── controllerPost.js   # Lógica para creación de pozos
│   │   │   └── controllerPut.js    # Lógica para actualización de pozos
│   │   ├── index.js           # Enrutador principal de la app
│   │   ├── pozoGet.js         # Mini-router para consultas (GET)
│   │   ├── pozoPost.js        # Mini-router para creación (POST)
│   │   ├── pozoPut.js         # Mini-router para actualización (PUT)
│   │   ├── pozoDelete.js      # Mini-router para eliminación (DELETE)
│   │   └── routes.js          # Agrupador de mini-routers
│   ├── services/
│   │   └── user.service.js    # Lógica de negocio
│   ├── utils/
│   │   └── asyncHandler.js    # Utilidad para manejo de promesas asíncronas
│   ├── validators/
│   │   └── user.validator.js  # Validación de datos de entrada
│   ├── app.js                 # Configuración de Express
│   └── server.js              # Punto de entrada y arranque del servidor
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Instalación

```bash
npm install
cp .env.example .env
```

## Ejecución

```bash
npm run dev    # modo desarrollo (con nodemon)
npm start      # modo producción
```

## Tests

```bash
npm test
```
## .env
PORT=3008
DB_PATH=./database/trailerflix.json

# Documentación API RESTful - Gestión de Pozos Petroleros

## Sumario
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Tabla de Endpoints](#tabla-de-endpoints)
4. [Ejemplos de Estructura de Datos](#ejemplos-de-estructura-de-datos)
    - [Estructura de Documento para Consultas (GET)](#1-estructura-de-documento-para-consultas-get)
    - [Cuerpo de Solicitud para Creación (POST)](#2-cuerpo-de-solicitud-para-creación-post)

---

## Descripción del Proyecto
API RESTful desarrollada en Node.js y Express utilizando una base de datos no relacional en MongoDB. El sistema permite gestionar un registro completo de pozos petroleros, aplicando un patrón modular de rutas, controladores individuales y manejo centralizado de errores asíncronos mediante `asyncHandler` y `errorHandler`.

## Tecnologías Utilizadas
* Node.js & Express.js
* MongoDB Atlas & Mongoose
* dotenv & Nodemon

---

## Tabla de Endpoints

| Método | Endpoint | Descripción | Código Éxito | Códigos de Error |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/pozos` | Obtiene el listado completo de pozos petroleros | `200 OK` | `500 Internal Server Error` |
| **GET** | `/api/pozos/:id` | Obtiene un pozo específico buscando por su ID numérico | `200 OK` | `404 Not Found`, `500 Server Error` |
| **GET** | `/api/pozos/yacimiento/:yacimiento` | Filtra y obtiene los pozos según el yacimiento indicado | `200 OK` | `404 Not Found`, `500 Server Error` |
| **POST** | `/api/pozos` | Crea y almacena un nuevo pozo en la base de datos | `201 Created` | `400 Bad Request`, `500 Server Error` |
| **PUT** | `/api/pozos/:id` | Actualiza la información de un pozo existente por ID | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/pozos/:id` | Elimina un pozo específico de la base de datos por ID | `200 OK` | `404 Not Found`, `500 Server Error` |

---

## Ejemplos de Estructura de Datos

### 1. Estructura de Documento para Consultas (GET)
Respuesta obtenida al consultar un elemento individual mediante `GET /api/pozos/1`:

```json
{
  "id": 1,
  "nombre": "Pozo A-1",
  "yacimiento": "Loma Campana",
  "estado": "activo",
  "icono": "🛢️",
  "profundidadMetros": 3200,
  "produccionDiariaBarriles": 450
}
