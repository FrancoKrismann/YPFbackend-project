# YPFbackend-project

API REST de catálogo de contenido audiovisual (series y películas) construida con **Node.js**, **Express** y **Sequelize** sobre **MySQL**.

Cada contenido tiene una categoría, uno o más géneros y un reparto de actores. Las relaciones se crean automáticamente al registrar el contenido y la API devuelve todo en un formato simple (géneros y actores como arrays de texto).

---

## Tecnologías

- Node.js + Express
- Sequelize (ORM) + mysql2
- MySQL
- dotenv
- Thunder Client / Postman para probar los endpoints

---

## Estructura del proyecto

```
YPFbackend-project/
├── database/
│   ├── data.json            # Datos de catálogo para cargar
│   └── sql.js               # Conexión de Sequelize a MySQL
├── src/
│   ├── app.js               # Configuración de Express y middlewares
│   ├── server.js            # Arranque: conexión, sync y carga inicial
│   ├── seed.js              # Carga inicial del catálogo
│   ├── models/
│   │   ├── index.js         # Asociaciones entre modelos
│   │   ├── contenido.js
│   │   ├── categoria.js
│   │   ├── genero.js
│   │   └── actor.js
│   ├── routes/
│   │   ├── routes.js        # Rutas principales
│   │   ├── contenidoGets.js
│   │   ├── contenidoPost.js
│   │   ├── contenidoPut.js
│   │   ├── contenidoDelete.js
│   │   └── controllers/     # Lógica de cada operación
│   ├── services/
│   ├── utils/               # asyncHandler, formatear
│   ├── validators/
│   └── middlewares/
├── .env
└── package.json
```

---

## Instalación

```bash
git clone https://github.com/FrancoKrismann/YPFbackend-project.git
cd YPFbackend-project
npm install
```

### Variables de entorno

Creá un archivo `.env` en la raíz del proyecto. Los nombres deben coincidir con los que lee `database/sql.js`:

```env
PORT=3008
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_db
```

> El archivo `.env` no se sube al repositorio (está en `.gitignore`).

### Ejecutar

```bash
npm start
```

Si todo está bien, la terminal muestra:

```
Conectado a MySQL
Catálogo ya cargado
Servidor en http://localhost:3008
```

Para que el servidor se reinicie solo al guardar cambios, podés usar `node --watch src/server.js` en el script `start`.

---

## Base de datos

### 1. Crear la base

```sql
CREATE DATABASE IF NOT EXISTS nombre_de_tu_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nombre_de_tu_db;
```

### 2. Crear las tablas

Las tablas **no hay que crearlas a mano**: Sequelize las genera a partir de los modelos al iniciar el servidor (`sequelize.sync()`). Para ver las que se crearon y su estructura:

```sql
SHOW TABLES;
DESCRIBE contenidos;
```

La tabla `contenidos` tiene estas columnas:

| Columna      | Tipo         | Notas                                   |
|--------------|--------------|-----------------------------------------|
| `id`         | INT          | Clave primaria, autoincremental         |
| `titulo`     | VARCHAR(150) | Obligatorio                             |
| `sinopsis`   | TEXT         | Obligatorio                             |
| `temporadas` | INT          | Opcional (NULL para películas)          |
| `trailer`    | VARCHAR(255) | Opcional                                |
| `categoriaId`| INT          | Clave foránea a la tabla de categorías  |

Los géneros y actores se relacionan con `contenidos` mediante tablas intermedias (relación muchos a muchos) que Sequelize crea solo.

### 3. Modelo de relaciones

```
Categoria 1 ──── N Contenido N ──── N Genero
                       │
                       N
                       │
                     Actor
```

```javascript
Contenido.belongsTo(Categoria, { as: 'categoria', foreignKey: 'categoriaId' });
Categoria.hasMany(Contenido, { as: 'contenidos', foreignKey: 'categoriaId' });
```

### 4. Datos de prueba

Lo más simple es cargar los datos **a través de la API** (ver la sección de pruebas), porque así se crean también las categorías, géneros y actores y sus relaciones.

Si preferís cargar por SQL, primero hay que tener las categorías. Verificá el nombre real de la tabla con `SHOW TABLES;` y ajustalo en el `INSERT`:

```sql
-- Reemplazá "categorias" por el nombre real de tu tabla
INSERT INTO categorias (nombre) VALUES ('Serie'), ('Película');
```

Con la categoría creada, podés insertar contenido directamente:

```sql
INSERT INTO contenidos (titulo, sinopsis, temporadas, trailer, categoriaId) VALUES
('Riverdale',
 'Detrás de la fachada tranquila de un pueblo pequeño, un grupo de estudiantes investiga un crimen que deja al descubierto los secretos más oscuros de sus familias y vecinos.',
 7,
 'https://www.youtube.com/results?search_query=Riverdale+trailer+oficial',
 1),
('Stranger Things',
 'Cuando un niño desaparece en un pequeño pueblo de Indiana, sus amigos, su familia y el jefe de policía se ven envueltos en un misterio que incluye experimentos secretos y fuerzas sobrenaturales.',
 5,
 'https://www.youtube.com/results?search_query=Stranger+Things+trailer+oficial',
 1),
('Breaking Bad',
 'Un profesor de química de secundaria diagnosticado con una enfermedad grave se asocia con un ex alumno para fabricar y vender metanfetamina para asegurar el futuro de su familia.',
 5,
 'https://www.youtube.com/results?search_query=Breaking+Bad+trailer+oficial',
 1);
```

> Insertando por SQL, los contenidos quedan sin géneros ni actores. Para tener todo completo, usá el endpoint `POST`.

### 5. Reiniciar las tablas sin borrar la base

**Opción A: desde Sequelize** (en `server.js`, donde está el `sync`):

```javascript
await sequelize.sync({ force: true });
```

Recrea todas las tablas de los modelos con la estructura actual. **Quitá `force: true` después de la primera ejecución**, porque si queda, borra todo cada vez que reiniciás el servidor.

**Opción B: desde MySQL.** Revisá los nombres con `SHOW TABLES;` e incluí también las tablas intermedias:

```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contenidos, categorias, generos, actors;
-- agregá acá las tablas intermedias que aparezcan en SHOW TABLES
SET FOREIGN_KEY_CHECKS = 1;
```

**Opción C: solo vaciar los datos** (mantiene la estructura y reinicia los ids):

```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE contenidos;
-- una línea por cada tabla
SET FOREIGN_KEY_CHECKS = 1;
```

> Estas operaciones no se pueden deshacer. Hacé un respaldo antes si los datos importan.

---

## Endpoints

URL base: `http://localhost:3008`

> Las rutas de esta tabla corresponden a lo configurado en `routes.js`. Si cambiás el prefijo (`app.use('/contenido', ...)`), actualizá la documentación.

| Método   | Ruta                              | Descripción                                                          |
|----------|-----------------------------------|----------------------------------------------------------------------|
| `GET`    | `/contenido`                      | Lista todo el contenido (admite filtros combinados por Query Params) |
| `GET`    | `/contenido/:id`                  | Obtiene un contenido por su ID numérico o por su título             |
| `GET`    | `/contenido/titulo/:titulo`       | Filtra contenidos por título (coincidencia parcial)                  |
| `GET`    | `/contenido/categoria/:categoria` | Filtra contenidos por categoría (`Serie` o `Película`)               |
| `GET`    | `/contenido/genero/:genero`       | Filtra contenidos por género (ej: `Drama`, `Ciencia Ficción`)        |
| `GET`    | `/contenido/actor/:actor`         | Filtra contenidos por actor / reparto (ej: `Pedro Pascal`)           |
| `POST`   | `/contenido`                      | Crea un nuevo contenido                                              |
| `PUT`    | `/contenido/:id`                  | Modifica un contenido existente por su ID                            |
| `DELETE` | `/contenido/:id`                  | Elimina un contenido por su ID numérico o por su título              |
| `DELETE` | `/contenido/titulo/:titulo`       | Elimina un contenido por su título                                   |

### Formato de respuesta

Todos los endpoints devuelven el contenido con este formato:

```json
{
  "id": 1,
  "titulo": "Riverdale",
  "sinopsis": "Detrás de la fachada tranquila de un pueblo pequeño...",
  "temporadas": 7,
  "trailer": "https://www.youtube.com/results?search_query=Riverdale+trailer+oficial",
  "categoria": "Serie",
  "generos": ["Drama", "Misterio", "Suspenso"],
  "actores": ["KJ Apa", "Lili Reinhart", "Camila Mendes"]
}
```

La conversión se hace en `src/utils/formatear.js`, y es la misma para todos los controladores:

```javascript
function formatear(contenido) {
  const plano = contenido.toJSON();
  const { categoria, categoriaId, Generos, Actors, ...resto } = plano;

  return {
    ...resto,
    categoria: categoria?.nombre ?? null,
    generos: (Generos ?? []).map((g) => g.nombre),
    actores: (Actors ?? []).map((a) => a.nombre),
  };
}
```

### Cuerpo de la petición (POST y PUT)

Se envía en **JSON** con el header `Content-Type: application/json`.

| Campo        | Tipo             | Obligatorio | Notas                                                       |
|--------------|------------------|-------------|-------------------------------------------------------------|
| `titulo`     | string           | Sí          | Hasta 150 caracteres                                        |
| `sinopsis`   | string           | Sí          |                                                             |
| `categoria`  | string           | Sí          | Se busca o se crea por nombre (por ej. `Serie`, `Película`) |
| `generos`    | string o array   | No          | Texto separado por comas o array                            |
| `reparto`    | string o array   | No          | Texto separado por comas o array                            |
| `temporadas` | number           | No          | Omitir en películas                                         |
| `trailer`    | string           | No          | URL                                                         |

> `generos` y `reparto` aceptan `"Drama, Misterio"` o `["Drama", "Misterio"]`. Los géneros y actores que no existan se crean automáticamente (`findOrCreate`).

---

## Pruebas de los endpoints

Se pueden ejecutar con Thunder Client (extensión de VS Code), Postman o `curl`.

> **Importante:** en Thunder Client, el cuerpo hay que enviarlo en la pestaña **Body → JSON**. Si se usa la pestaña **Form** (multipart/form-data), Express recibe `req.body` vacío (`{}`), porque la API solo procesa JSON.

### 1. Crear contenido: `POST /contenido`

**Body (JSON):**

```json
{
  "titulo": "Riverdale",
  "categoria": "Serie",
  "generos": "Drama, Misterio, Suspenso",
  "sinopsis": "Detrás de la fachada tranquila de un pueblo pequeño, un grupo de estudiantes investiga un crimen que deja al descubierto los secretos más oscuros de sus familias y vecinos.",
  "temporadas": 7,
  "reparto": "KJ Apa, Lili Reinhart, Camila Mendes, Cole Sprouse, Madelaine Petsch",
  "trailer": "https://www.youtube.com/results?search_query=Riverdale+trailer+oficial"
}
```

**curl:**

```bash
curl -X POST http://localhost:3008/contenido \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Riverdale",
    "categoria": "Serie",
    "generos": "Drama, Misterio, Suspenso",
    "sinopsis": "Detrás de la fachada tranquila de un pueblo pequeño...",
    "temporadas": 7,
    "reparto": "KJ Apa, Lili Reinhart, Camila Mendes",
    "trailer": "https://www.youtube.com/results?search_query=Riverdale+trailer+oficial"
  }'
```

**Respuesta esperada:** `201 Created`

```json
{
  "id": 1,
  "titulo": "Riverdale",
  "sinopsis": "Detrás de la fachada tranquila de un pueblo pequeño...",
  "temporadas": 7,
  "trailer": "https://www.youtube.com/results?search_query=Riverdale+trailer+oficial",
  "categoria": "Serie",
  "generos": ["Drama", "Misterio", "Suspenso"],
  "actores": ["KJ Apa", "Lili Reinhart", "Camila Mendes", "Cole Sprouse", "Madelaine Petsch"]
}
```

### 2. Crear una película (sin temporadas)

```json
{
  "titulo": "Interestelar",
  "categoria": "Película",
  "generos": ["Ciencia ficción", "Drama", "Aventura"],
  "sinopsis": "Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.",
  "reparto": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
  "trailer": "https://www.youtube.com/results?search_query=Interestelar+trailer+oficial"
}
```

**Respuesta esperada:** `201 Created`, con `"temporadas": null` y `"categoria": "Película"`.

### 3. Más datos de prueba

```json
{
  "titulo": "Stranger Things",
  "categoria": "Serie",
  "generos": "Ciencia ficción, Terror, Drama",
  "sinopsis": "Cuando un niño desaparece en un pequeño pueblo de Indiana, sus amigos, su familia y el jefe de policía se ven envueltos en un misterio que incluye experimentos secretos y fuerzas sobrenaturales.",
  "temporadas": 5,
  "reparto": "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour, Gaten Matarazzo",
  "trailer": "https://www.youtube.com/results?search_query=Stranger+Things+trailer+oficial"
}
```

```json
{
  "titulo": "Breaking Bad",
  "categoria": "Serie",
  "generos": "Drama, Crimen, Suspenso",
  "sinopsis": "Un profesor de química de secundaria diagnosticado con una enfermedad grave se asocia con un ex alumno para fabricar y vender metanfetamina para asegurar el futuro de su familia.",
  "temporadas": 5,
  "reparto": "Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris, Bob Odenkirk",
  "trailer": "https://www.youtube.com/results?search_query=Breaking+Bad+trailer+oficial"
}
```

### 4. Listar todo: `GET /contenido`

```bash
curl http://localhost:3008/contenido
```

**Respuesta esperada:** `200 OK`, con un array de todos los contenidos en el formato de respuesta.

---

### 5. Filtrar contenidos por Query Parameters: `GET /contenido?...`

El endpoint raíz `GET /contenido` permite aplicar filtros combinados a través de parámetros de consulta (query params):

#### A. Filtrar por Categoría
```bash
curl "http://localhost:3008/contenido?categoria=Serie"
curl "http://localhost:3008/contenido?categoria=Película"
```

#### B. Filtrar por Género
```bash
curl "http://localhost:3008/contenido?genero=Drama"
curl "http://localhost:3008/contenido?genero=Ciencia%20Ficción"
```

#### C. Filtrar por Actor o Reparto
```bash
curl "http://localhost:3008/contenido?actor=Pedro%20Pascal"
```

#### D. Filtrar / Buscar por Título (coincidencia parcial)
```bash
curl "http://localhost:3008/contenido?titulo=Mandalorian"
```

#### E. Combinar múltiples filtros a la vez
```bash
curl "http://localhost:3008/contenido?categoria=Serie&genero=Drama"
```

> **En Thunder Client:** En lugar de escribir la URL larga, puedes ir a la pestaña **Query** debajo de la barra de direcciones y agregar los parámetros `categoria`, `genero`, `actor` o `titulo` en la tabla de clave/valor.

---

### 6. Obtener por ID o Título directo: `GET /contenido/:id`

Este endpoint detecta automáticamente si el parámetro es numérico o un texto:

* **Por ID numérico:**
  ```bash
  curl http://localhost:3008/contenido/1
  ```
* **Por Título directo:**
  ```bash
  curl "http://localhost:3008/contenido/The%20Crown"
  ```

**Respuesta esperada:** `200 OK`, con el contenido individual en el formato de respuesta.

**ID o Título inexistente:**
```bash
curl http://localhost:3008/contenido/9999
```
```json
{ "error": "Contenido con ID 9999 no encontrado" }
```
Estado: `404 Not Found`.

---

### 7. Endpoints directos por ruta (URL Params)

También puedes consultar directamente usando segmentos en la URL:

* **Por Título:**
  ```bash
  curl "http://localhost:3008/contenido/titulo/Riverdale"
  ```
* **Por Categoría:**
  ```bash
  curl "http://localhost:3008/contenido/categoria/Serie"
  ```
* **Por Género:**
  ```bash
  curl "http://localhost:3008/contenido/genero/Drama"
  ```
* **Por Actor / Reparto:**
  ```bash
  curl "http://localhost:3008/contenido/actor/Pedro%20Pascal"
  ```

---

### 8. Modificar: `PUT /contenido/:id`

Para modificar hay que usar el **id real** del registro. Si se usa un texto en lugar del id (por ejemplo `/contenido/nuevo`), la API lo interpreta como un id inexistente y devuelve `404`.

```bash
curl -X PUT http://localhost:3008/contenido/1 \
  -H "Content-Type: application/json" \
  -d '{ "titulo": "Riverdale (editado)", "temporadas": 7 }'
```

**Respuesta esperada:** `200 OK` con el contenido actualizado.

**Id inexistente:**

```json
{ "error": "Contenido no encontrado" }
```

Estado: `404 Not Found`.

### 9. Eliminar contenido: `DELETE /contenido/:id` o por Título

Se puede eliminar tanto por ID numérico como por título:

* **Por ID numérico:**
  ```bash
  curl -X DELETE http://localhost:3008/contenido/1
  ```
* **Por Título directo:**
  ```bash
  curl -X DELETE "http://localhost:3008/contenido/Riverdale"
  ```
* **Por ruta específica de título:**
  ```bash
  curl -X DELETE "http://localhost:3008/contenido/titulo/Riverdale"
  ```

**Respuesta esperada:** `200 OK`
```json
{
  "mensaje": "Contenido eliminado correctamente",
  "id": 1,
  "titulo": "Riverdale"
}
```

---

## Errores frecuentes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `req.body` llega vacío (`{}`) | Se envió como Form (multipart) o falta `Content-Type: application/json` | Enviar en Body → **JSON**. Verificar que `express.json()` esté antes de las rutas |
| `404` al hacer `PUT /contenido/nuevo` | `nuevo` se interpreta como `:id` | Usar `POST /contenido` para crear y `PUT /contenido/<id>` para editar |
| `ERR_HTTP_INVALID_STATUS_CODE` | Se llamó `res.json("texto", objeto)` con dos argumentos | `res.json()` recibe un único argumento: `res.status(201).json(formatear(contenido))` |
| `Field 'categoriaId' doesn't have a default value` | El `create` no recibió `categoriaId` | Pasar `categoriaId: categoriaRecord.id` y enviar el campo `categoria` en el body |
| `categoria: null` o aparece `Categorium` en la respuesta | El `include` no tiene el alias `as: 'categoria'` | Usar `{ model: Categoria, as: 'categoria', attributes: ['nombre'] }` en `incluir` |
| Géneros y actores llegan como objetos | El controlador devuelve el objeto de Sequelize sin pasar por `formatear` | Usar `formatear(contenido)` en todos los controladores |
| Los cambios no se reflejan | El servidor no se reinició | Cortar con Ctrl+C y ejecutar `npm start`, o usar `node --watch` |

---

## Scripts

| Comando       | Descripción                  |
|---------------|------------------------------|
| `npm start`   | Inicia el servidor           |

---
