const { getConnection, sql } = require('../config/db');

async function findAdminByEmail(email) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM administradores WHERE email = @email');
  return result.recordset[0];
}

async function createAdmin(admin) {
  const pool = await getConnection();
  await pool.request()
    .input('nombreCompleto', sql.NVarChar, admin.nombreCompleto)
    .input('email', sql.NVarChar, admin.email)
    .input('telefono', sql.NVarChar, admin.telefono)
    .input('carnet', sql.NVarChar, admin.carnet)
    .input('passwordHash', sql.VarBinary, admin.passwordHash)
    .input('idRol', sql.TinyInt, admin.idRol)
    .query(`
      INSERT INTO administradores (nombreCompleto, email, telefono, carnet, passwordHash, idRol, estado, fechaCreacion, fechaActualizado)
      VALUES (@nombreCompleto, @email, @telefono, @carnet, @passwordHash, @idRol, 1, SYSDATETIME(), SYSDATETIME())
    `);
}

module.exports = { findAdminByEmail, createAdmin };
