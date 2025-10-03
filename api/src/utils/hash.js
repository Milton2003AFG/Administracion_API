const crypto = require('crypto');

// Devuelve un hash binario (Buffer)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest();
}

function comparePassword(password, hashed) {
  const hash = hashPassword(password);
  return Buffer.compare(hash, hashed) === 0;
}

module.exports = { hashPassword, comparePassword };
