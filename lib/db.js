const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'internet_camargo';

let pool;

async function initDatabase() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  });

  const connection = await pool.getConnection();
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${DB_NAME}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(100),
        direccion VARCHAR(255),
        plan VARCHAR(100),
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        servicio VARCHAR(255),
        mensaje TEXT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(100),
        direccion VARCHAR(255),
        platillo VARCHAR(255) NOT NULL,
        cantidad INT DEFAULT 1,
        notas TEXT,
        tipo_entrega VARCHAR(50) DEFAULT 'recoger',
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Añadir columnas de precio si no existen (MySQL 8+ soporta IF NOT EXISTS)
      ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS precio_unitario DECIMAL(10,2) DEFAULT 0;
      ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS precio_total DECIMAL(10,2) DEFAULT 0;

      CREATE TABLE IF NOT EXISTS ventas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_nombre VARCHAR(255) NOT NULL,
        cliente_telefono VARCHAR(100),
        cliente_email VARCHAR(255),
        items JSON NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return pool;
  } finally {
    connection.release();
  }
}

module.exports = { initDatabase };
