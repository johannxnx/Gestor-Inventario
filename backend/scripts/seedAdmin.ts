import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Script para crear el primer usuario administrador en PostgreSQL
// Ejecutar UNA sola vez con: npm run seed

const seedAdmin = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER || "localhost",
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
  });

  // Hasheo la contraseña antes de guardarla
  const hash = await bcrypt.hash("admin123", 10);

  // Inserto el admin solo si no existe: ON CONFLICT DO NOTHING evita el error
  // si el usuario ya existe, gracias a la restricción UNIQUE del campo usuario
  await pool.query(
    `INSERT INTO usuarios (usuario, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (usuario) DO NOTHING`,
    ["admin", hash]
  );

  console.log("✓ Usuario administrador creado");
  console.log("  usuario:    admin");
  console.log("  contraseña: admin123");
  console.log("");
  console.log("  Cambia la contraseña después del primer ingreso.");

  await pool.end();
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("Error al crear el usuario admin:", err.message);
  process.exit(1);
});
