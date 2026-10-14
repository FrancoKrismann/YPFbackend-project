# Documentación API RESTful - Gestión de Pozos Petroleros (YPF)

## Sumario
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Tabla de Endpoints](#tabla-de-endpoints)
6. [Ejemplos de Uso y Estructura de Datos](#ejemplos-de-uso-y-estructura-de-datos)
   - [1. Consultar todos los pozos o filtrar por Query (GET)](#1-consultar-todos-los-pozos-o-filtrar-por-query-get)
   - [2. Consultar un pozo específico por ID (GET)](#2-consultar-un-pozo-específico-por-id-get)
   - [3. Consultar pozos por Yacimiento (GET)](#3-consultar-pozos-por-yacimiento-get)
   - [4. Crear un nuevo pozo (POST)](#4-crear-un-nuevo-pozo-post)
   - [5. Actualizar un pozo existente (PUT)](#5-actualizar-un-pozo-existente-put)
   - [6. Eliminar un pozo por ID (DELETE)](#6-eliminar-un-pozo-por-id-delete)
7. [Manejo de Errores](#manejo-de-errores)

---

## Descripción del Proyecto
API RESTful modular construida con **Node.js** y **Express**, conectada a una base de datos NoSQL en **MongoDB Atlas** mediante el ODM **Mongoose**. 

El sistema administra la información técnica y de producción de pozos petroleros (identificación, nombre, yacimiento geográfico, estado operativo, profundidad y barriles de producción diaria). Implementa un patrón modular de rutas individuales por método HTTP, controladores dedicados, validación de esquemas y manejo centralizado de excepciones asíncronas con `asyncHandler`.

---

## Tecnologías Utilizadas
* **Node.js** (Entorno de ejecución)
* **Express.js** (Framework de backend para routing y middleware)
* **MongoDB Atlas** (Base de datos NoSQL en la nube)
* **Mongoose** (Modelado y validación de esquemas)
* **dotenv** (Gestión de variables de entorno)
* **Nodemon** (Recarga automática en entorno de desarrollo)
* **CORS** (Manejo de intercambio de recursos de origen cruzado)

---

## Estructura del Proyecto

```text
YPFbackend-project/
├── database/
│   ├── data.js                # Datos iniciales en memoria
│   ├── dataCarge.js           # Script de sembrado inicial (seed)
│   └── mongodb.js             # Módulo de conexión a MongoDB Atlas
├── src/
│   ├── middlewares/
│   │   ├── auth.js            # Middleware de autenticación
│   │   └── errorHandler.js    # Manejo centralizado de errores
│   ├── models/
│   │   └── pozo.model.js      # Esquema y modelo de Mongoose
│   ├── routes/
│   │   ├── controllers/
│   │   │   ├── controllerDelete.js # Lógica de eliminación
│   │   │   ├── controllerGet.js    # Lógica de consultas y filtros
│   │   │   ├── controllerPost.js   # Lógica de creación
│   │   │   └── controllerPut.js    # Lógica de actualización
│   │   ├── index.js           # Enrutador central
│   │   ├── pozoDelete.js      # Sub-router DELETE
│   │   ├── pozoGet.js         # Sub-router GET
│   │   ├── pozoPost.js        # Sub-router POST
│   │   ├── pozoPut.js         # Sub-router PUT
│   │   └── routes.js          # Agrupador de mini-routers
│   ├── utils/
│   │   └── asyncHandler.js    # Envoltorio para promesas asíncronas
│   ├── app.js                 # Configuración de Express y middlewares
│   └── server.js              # Arranque del servidor y conexión a DB
├── .env                       # Plantilla de variables de entorno
├── .gitignore                 # Archivos y carpetas ignorados por Git
├── package.json               # Dependencias y scripts del proyecto
└── README.md                  # Documentación principal
```

---

## Instalación y Configuración

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar las variables de entorno:**
   Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:
   ```env
   PORT=3008
   DB_PATH=./database/data.js
   MONGO_URI=mongodb+srv://<usuario>:<password>@ypftest.hu7stc7.mongodb.net/test?appName=YPFtest
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## Tabla de Endpoints

| Método | Endpoint | Parámetros | Descripción | Código Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **GET** | `/pozos` | Query: `estado`, `yacimiento`, `nombre` (opcionales) | Lista todos los pozos o aplica filtros combinados | `200 OK` | `500 Server Error` |
| **GET** | `/pozos/:id` | Path: `:id` (numérico o ObjectId) | Obtiene un pozo específico por su identificador | `200 OK` | `404 Not Found`, `500 Server Error` |
| **GET** | `/pozos/yacimiento/:yacimiento` | Path: `:yacimiento` (nombre geográfico) | Obtiene todos los pozos de un yacimiento específico | `200 OK` | `404 Not Found`, `500 Server Error` |
| **POST** | `/pozos/new` o `/pozos` | Body (JSON) o Query Parameters | Crea y almacena un nuevo pozo en la colección `pozos` | `201 Created` | `400 Bad Request`, `500 Server Error` |
| **PUT** | `/pozos/:id` | Path: `:id` + Query o Body con campos a modificar | Actualiza campos de un pozo existente en la base de datos | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/pozos/:id` | Path: `:id` (numérico o ObjectId) | Elimina permanentemente el pozo de MongoDB | `200 OK` | `404 Not Found`, `500 Server Error` |

---

## Ejemplos de Uso y Estructura de Datos

### 1. Consultar todos los pozos o filtrar por Query (GET)

**Petición:**
```http
GET /pozos?estado=activo&yacimiento=Loma%20Campana HTTP/1.1
Host: localhost:3008
```

**Respuesta exitosa (`200 OK`):**
```json
[
  {
    "_id": "670c5a1f2b189c4d8e7f1201",
    "id": 1,
    "nombre": "Pozo A-1",
    "yacimiento": "Loma Campana",
    "estado": "activo",
    "icono": "🛢️",
    "profundidadMetros": 3200,
    "produccionDiariaBarriles": 450,
    "createdAt": "2026-10-12T20:30:00.000Z",
    "updatedAt": "2026-10-12T20:30:00.000Z"
  }
]
```

---

### 2. Consultar un pozo específico por ID (GET)

**Petición:**
```http
GET /pozos/8 HTTP/1.1
Host: localhost:3008
```

**Respuesta exitosa (`200 OK`):**
```json
{
  "_id": "670c5b332b189c4d8e7f1208",
  "id": 8,
  "nombre": "Pozo H-8",
  "yacimiento": "Rincón del Mangrullo",
  "estado": "activo",
  "icono": "⚡",
  "profundidadMetros": 3300,
  "produccionDiariaBarriles": 510,
  "createdAt": "2026-10-13T21:00:00.000Z",
  "updatedAt": "2026-10-13T21:00:00.000Z"
}
```

---

### 3. Consultar pozos por Yacimiento (GET)

**Petición:**
```http
GET /pozos/yacimiento/Cruz%20de%20Lorena HTTP/1.1
Host: localhost:3008
```

**Respuesta exitosa (`200 OK`):**
```json
[
  {
    "_id": "670c5c442b189c4d8e7f1207",
    "id": 7,
    "nombre": "Pozo G-7",
    "yacimiento": "Cruz de Lorena",
    "estado": "activo",
    "icono": "🛢️",
    "profundidadMetros": 3750,
    "produccionDiariaBarriles": 620
  }
]
```

---

### 4. Crear un nuevo pozo (POST)

## Tecnologías Utilizadas
* Node.js & Express.js
* MongoDB Atlas & Mongoose
* dotenv & Nodemon

#### A. Mediante Body (JSON):
**Petición:**
```http
POST /pozos/new HTTP/1.1
Host: localhost:3008
Content-Type: application/json

{
  "id": 9,
  "nombre": "Pozo I-9",
  "yacimiento": "Aguada de Castro",
  "estado": "mantenimiento",
  "icono": "🔧",
  "profundidadMetros": 3600,
  "produccionDiariaBarriles": 95
}
```

#### B. Mediante Query Parameters:
```http
POST /pozos/new?id=9&nombre=Pozo%20I-9&yacimiento=Aguada%20de%20Castro&estado=mantenimiento&icono=🔧&profundidadMetros=3600&produccionDiariaBarriles=95 HTTP/1.1
Host: localhost:3008
```

**Respuesta exitosa (`201 Created`):**
```json
{
  "mensaje": "Pozo creado exitosamente",
  "pozo": {
    "_id": "670c5d552b189c4d8e7f1209",
    "id": 9,
    "nombre": "Pozo I-9",
    "yacimiento": "Aguada de Castro",
    "estado": "mantenimiento",
    "icono": "🔧",
    "profundidadMetros": 3600,
    "produccionDiariaBarriles": 95,
    "createdAt": "2026-10-13T21:15:00.000Z",
    "updatedAt": "2026-10-13T21:15:00.000Z"
  }
}
```

---

### 5. Actualizar un pozo existente (PUT)

Actualiza de forma parcial o total un pozo buscando por su ID. Los campos a modificar pueden enviarse a través de **Query Parameters** o en el **Body (JSON)**.

**Petición:**
```http
PUT /pozos/8?estado=inactivo&produccionDiariaBarriles=0 HTTP/1.1
Host: localhost:3008
```

**Respuesta exitosa (`200 OK`):**
```json
{
  "mensaje": "Pozo actualizado correctamente en la base de datos",
  "data": {
    "_id": "670c5b332b189c4d8e7f1208",
    "id": 8,
    "nombre": "Pozo H-8",
    "yacimiento": "Rincón del Mangrullo",
    "estado": "inactivo",
    "icono": "⚡",
    "profundidadMetros": 3300,
    "produccionDiariaBarriles": 0,
    "createdAt": "2026-10-13T21:00:00.000Z",
    "updatedAt": "2026-10-13T21:30:00.000Z"
  }
}
```

---

### 6. Eliminar un pozo por ID (DELETE)

**Petición:**
```http
DELETE /pozos/8 HTTP/1.1
Host: localhost:3008
```

**Respuesta exitosa (`200 OK`):**
```json
{
  "mensaje": "Pozo eliminado correctamente de la base de datos",
  "data": {
    "_id": "670c5b332b189c4d8e7f1208",
    "id": 8,
    "nombre": "Pozo H-8",
    "yacimiento": "Rincón del Mangrullo",
    "estado": "inactivo"
  }
}
```

---

## Manejo de Errores

La API utiliza respuestas JSON normalizadas para los estados de error:

* **`400 Bad Request`** (Datos faltantes o valores no permitidos en el enum de `estado`):
  ```json
  {
    "error": "El estado 'cerado' no es válido. Debe ser uno de: activo, inactivo, mantenimiento, cerrado"
  }
  ```

* **`404 Not Found`** (Recurso inexistente en MongoDB):
  ```json
  {
    "error": "Pozo no encontrado"
  }
  ```

* **`500 Internal Server Error`** (Fallo interno o de conexión):
  ```json
  {
    "error": "Error interno del servidor"
  }
  ```
