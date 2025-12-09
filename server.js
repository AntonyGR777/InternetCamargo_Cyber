const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDatabase } = require('./lib/db');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});

const pageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 page requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter); // Apply rate limiting to API routes
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization is handled in `lib/db.js`.

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Register a new client
app.post('/api/clientes', (req, res) => {
  (async () => {
    try {
      const { nombre, email, telefono, direccion, plan } = req.body;
      if (!nombre || !email) return res.status(400).json({ error: 'Nombre y email son requeridos' });
      if (!isValidEmail(email)) return res.status(400).json({ error: 'El formato del email no es válido' });

      const [result] = await app.locals.pool.execute(
        'INSERT INTO clientes (nombre, email, telefono, direccion, plan) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, telefono || '', direccion || '', plan || '']
      );

      res.status(201).json({ message: 'Cliente registrado exitosamente', id: result.insertId });
    } catch (error) {
      console.error('Error registering client:', error);
      res.status(500).json({ error: 'Error al registrar el cliente' });
    }
  })();
});

// Get all clients
app.get('/api/clientes', (req, res) => {
  (async () => {
    try {
      const [clientes] = await app.locals.pool.query('SELECT * FROM clientes ORDER BY fecha_registro DESC');
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  })();
});

// Submit contact form
app.post('/api/contacto', (req, res) => {
  (async () => {
    try {
      const { nombre, telefono, email, servicio, mensaje } = req.body;
      if (!nombre || !telefono || !email || !servicio || !mensaje) return res.status(400).json({ error: 'Todos los campos son requeridos' });
      if (!isValidEmail(email)) return res.status(400).json({ error: 'El formato del email no es válido' });

      const [result] = await app.locals.pool.execute('INSERT INTO contactos (nombre, telefono, email, servicio, mensaje) VALUES (?, ?, ?, ?, ?)', [nombre, telefono, email, servicio, mensaje]);
      res.status(201).json({ message: 'Mensaje enviado exitosamente', id: result.insertId });
    } catch (error) {
      console.error('Error sending contact message:', error);
      res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
  })();
});

// Get all contact messages
app.get('/api/contactos', (req, res) => {
  (async () => {
    try {
      const [contactos] = await app.locals.pool.query('SELECT * FROM contactos ORDER BY fecha DESC');
      res.json(contactos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
  })();
});

// Submit an order for platillos (chicken dishes)
app.post('/api/order', (req, res) => {
  (async () => {
    try {
      const { nombre, telefono, direccion, platillo, cantidad, notas, tipo_entrega, precio_unitario, precio_total } = req.body;
      if (!nombre || !platillo) return res.status(400).json({ error: 'Nombre y platillo son requeridos' });

      const qty = parseInt(cantidad) || 1;
      const pu = parseFloat(precio_unitario) || 0;
      const pt = typeof precio_total !== 'undefined' ? parseFloat(precio_total) : +(pu * qty);

      const [result] = await app.locals.pool.execute(
        'INSERT INTO pedidos (nombre, telefono, direccion, platillo, cantidad, notas, tipo_entrega, precio_unitario, precio_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, telefono || '', direccion || '', platillo, qty, notas || '', tipo_entrega || 'recoger', pu, pt]
      );

      res.status(201).json({ message: 'Pedido recibido', id: result.insertId });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error al crear el pedido' });
    }
  })();
});

// Submit a sales request (tóner, cartuchos, equipos, etc.)
app.post('/api/ventas', (req, res) => {
  (async () => {
    try {
      const { cliente, items } = req.body;
      if (!cliente || !cliente.nombre || !cliente.telefono) {
        return res.status(400).json({ error: 'Cliente (nombre y teléfono) e items son requeridos' });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Debe haber al menos un item en la solicitud' });
      }

      const itemsJson = JSON.stringify(items);
      const [result] = await app.locals.pool.execute(
        'INSERT INTO ventas (cliente_nombre, cliente_telefono, cliente_email, items, estado) VALUES (?, ?, ?, ?, ?)',
        [cliente.nombre, cliente.telefono, cliente.email || '', itemsJson, 'pendiente']
      );

      res.status(201).json({ message: 'Solicitud de venta recibida', id: result.insertId });
    } catch (error) {
      console.error('Error creating sales request:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud de venta' });
    }
  })();
});

// Get all sales requests
app.get('/api/ventas', (req, res) => {
  (async () => {
    try {
      const [ventas] = await app.locals.pool.query('SELECT * FROM ventas ORDER BY fecha DESC');
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las solicitudes de venta' });
    }
  })();
});

// Servir archivos estáticos desde public
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// Servir index.html para rutas no encontradas
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize DB and start server
(async () => {
  try {
    const pool = await initDatabase();
    app.locals.pool = pool;
    app.listen(PORT, () => {
      console.log(`Servidor de Internet Camargo corriendo en http://localhost:${PORT}`);
      console.log(`Conexión a base de datos inicializada`);
    });
  } catch (err) {
    console.error('Error iniciando la aplicación:', err);
    process.exit(1);
  }
})();

module.exports = app;
