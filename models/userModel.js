const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

exports.createUser = async (user) => {
  const keys = Object.keys(user).join(", ");
  const values = Object.values(user);
  const placeholders = values.map(() => "?").join(", ");
  await db.query(
    `INSERT INTO users (${keys}) VALUES (${placeholders})`,
    values
  );
};

exports.countUsersByRoleAndYear = async (role, year) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) as count FROM users WHERE id LIKE ?",
    [`samcy/${year}/${role}/%`]
  );
  return rows[0].count;
};

exports.setResetToken = async (email, token, expiry) => {
  await db.query(
    "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
    [token, expiry, email]
  );
};

exports.findByResetToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()",
    [token]
  );
  return rows[0];
};

exports.updatePassword = async (id, hashedPassword) => {
  await db.query(
    "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?",
    [hashedPassword, id]
  );
};
