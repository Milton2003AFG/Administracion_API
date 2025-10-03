const { findAdminByEmail } = require('../models/admin.model');
const { comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const admin = await findAdminByEmail(email);
    if (!admin) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    if (!comparePassword(password, admin.passwordHash)) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    const token = generateToken({ idAdmin: admin.idAdmin, email: admin.email });
    res.json({ ok: true, token });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { login };
