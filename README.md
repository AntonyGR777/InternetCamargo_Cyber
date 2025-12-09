# Internet Camargo

Sitio web para el negocio Internet Camargo - Servicios de Internet de Alta Velocidad.

## 🚀 Características

- **Página principal** con información del negocio
- **Planes de Internet** cargados dinámicamente desde la base de datos
 - **Servicios** (Ciber, Reparación y Platillos de pollo) gestionados desde la interfaz
- **Formulario de registro** para nuevos clientes
- **Formulario de contacto** para consultas
 - **Base de datos MySQL** (se crea la base `internt_camargo` si el usuario tiene permisos)
- **API REST** para interactuar con la base de datos
- **Diseño responsivo** para dispositivos móviles

## 📋 Requisitos

- Node.js 18 o superior
- npm

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/AntonyGR777/Internet-Camargo.git
cd Internet-Camargo
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con las credenciales de la base de datos MySQL (opcional). Ejemplo:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=internt_camargo
PORT=3000
```

4. Inicia el servidor:
```bash
npm start
```

5. Abre tu navegador en `http://localhost:3000`
```bash
npm start
```

4. Abre tu navegador en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Internet-Camargo/
├── server.js          # Servidor Express y API (conexión MySQL)
├── public/
│   ├── index.html     # Página principal
│   ├── css/
│   │   └── styles.css # Estilos CSS
│   └── js/
│       └── app.js     # JavaScript del frontend
├── package.json
└── README.md
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Obtener todos los clientes |
| POST | `/api/clientes` | Registrar nuevo cliente |
| GET | `/api/contactos` | Obtener mensajes de contacto |
| POST | `/api/contacto` | Enviar mensaje de contacto |
| POST | `/api/order` | Enviar pedido de platillos |

## 💾 Base de Datos

La aplicación utiliza SQLite con las siguientes tablas:

- **clientes**: Almacena los datos de los clientes registrados
-- **pedidos**: Almacena los pedidos de platillos (nombre, telefono, platillo, cantidad, notas)
-- **contactos**: Almacena los mensajes del formulario de contacto

## 🛠️ Tecnologías

- **Backend**: Node.js, Express.js
- **Base de datos**: SQLite (better-sqlite3)
- **Frontend**: HTML5, CSS3, JavaScript
- **Estilos**: CSS personalizado con diseño responsivo

## 📞 Contacto

Internet Camargo - Camargo, Tamaulipas, México
