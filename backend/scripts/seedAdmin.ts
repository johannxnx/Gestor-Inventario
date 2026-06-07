import dotenv from "dotenv";
dotenv.config();

import sql from "mssql";
import bcrypt from "bcryptjs";

// Script para crear el primer usuario administrador en la base de datos.
// Ejecutar UNA sola vez desde la carpeta backend con: npm run seed

const seedAdmin = async () => {
  await sql.connect({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 1433,
    options: { encrypt: false, trustServerCertificate: true },
  });

  const hash = await bcrypt.hash("admin123", 10);

  await new sql.Request()
    .input("usuario", sql.NVarChar(50), "admin")
    .input("password_hash", sql.NVarChar(255), hash)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM usuarios WHERE usuario = @usuario)
        INSERT INTO usuarios (usuario, password_hash)
        VALUES (@usuario, @password_hash)
    `);

  console.log("✓ Usuario administrador creado");
  console.log("  usuario:    admin");
  console.log("  contraseña: admin123");
  console.log("");
  console.log("  Cambia la contraseña después del primer ingreso.");

  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("Error al crear el usuario admin:", err.message);
  process.exit(1);
});
