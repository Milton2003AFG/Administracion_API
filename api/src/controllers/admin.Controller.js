const { getConnection, sql } = require('../config/db');

async function getProfile(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idAdmin', sql.Int, req.user.idAdmin)
      .query('SELECT idAdmin, nombreCompleto, email, telefono, carnet, idRol FROM administradores WHERE idAdmin = @idAdmin');

    res.json({ ok: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { getProfile };
