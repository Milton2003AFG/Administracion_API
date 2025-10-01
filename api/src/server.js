require('dotenv').config();
const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: { max: 5, min: 0, idleTimeoutMillis: 30000 }
};

// Endpoint de salud
app.get('/health', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT name FROM sys.databases WHERE name = ${process.env.DB_NAME}`;
    res.json({ ok: true, db: result.recordset });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    try { await sql.close(); } catch(e){}
  }
});

// Ejemplo: obtener administradores
app.get('/administradores', async (req, res) => {
  try {
    await sql.connect(config);
    const { recordset } = await sql.query`SELECT TOP 10 * FROM dbo.administradores ORDER BY idAdmin DESC`;
    res.json({ ok: true, data: recordset });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    try { await sql.close(); } catch(e){}
  }
});

// Ejemplo: insertar un administrador (solo demo, normalmente harías hash del password antes)
app.post('/administradores', async (req, res) => {
  const { nombreCompleto, email, telefono, carnet, passwordHash, idRol } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO dbo.administradores (nombreCompleto, email, telefono, carnet, passwordHash, idRol, estado, fechaCreacion, fechaActualizado)
      VALUES (${nombreCompleto}, ${email}, ${telefono}, ${carnet}, CONVERT(VARBINARY(MAX), ${passwordHash}), ${idRol}, 1, SYSDATETIME(), SYSDATETIME())
    `;
    res.json({ ok: true, message: 'Administrador insertado' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    try { await sql.close(); } catch(e){}
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
