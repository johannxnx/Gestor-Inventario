// Cargo las variables de entorno PRIMERO antes de importar sql
// Si lo hiciera después, las variables del .env no estarían disponibles cuando sql las necesita
import dotenv from "dotenv";
dotenv.config();

// Importo el driver de SQL Server para conectarme a la base de datos
import sql from "mssql";

// bcryptjs para hashear la contraseña antes de guardarla en la base de datos
// NUNCA guardamos contraseñas en texto plano, siempre como hash
import bcrypt from "bcryptjs";

// Este script crea el primer usuario administrador en la base de datos
// Solo se ejecuta UNA vez con el comando: npm run seed (desde la carpeta backend)
// Si el usuario ya existe, no hace nada (gracias al IF NOT EXISTS en el SQL)

const seedAdmin = async () => {
  // Me conecto a la base de datos usando las variables del .env
  await sql.connect({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 1433,
    options: { encrypt: false, trustServerCertificate: true },
  });

  // Hasheo la contraseña "admin123" con bcrypt
  // El 10 es el número de "salt rounds": cuántas veces se procesa el hash
  // Más rounds = más seguro pero más lento. 10 es un valor estándar y equilibrado
  const hash = await bcrypt.hash("admin123", 10);

  // Inserto el usuario admin solo si no existe todavía en la tabla usuarios
  // El IF NOT EXISTS evita que falle si se ejecuta el script dos veces por accidente
  await new sql.Request()
    .input("usuario", sql.NVarChar(50), "admin")
    .input("password_hash", sql.NVarChar(255), hash)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM usuarios WHERE usuario = @usuario)
        INSERT INTO usuarios (usuario, password_hash)
        VALUES (@usuario, @password_hash)
    `);

  // Muestro los datos del usuario creado para que el desarrollador los tenga a mano
  console.log("✓ Usuario administrador creado");
  console.log("  usuario:    admin");
  console.log("  contraseña: admin123");
  console.log("");
  console.log("  Cambia la contraseña después del primer ingreso.");

  // Termino el proceso de Node.js porque este script no es un servidor, solo se ejecuta una vez
  process.exit(0);
};

// Ejecuto la función y manejo el error si algo sale mal
seedAdmin().catch((err) => {
  console.error("Error al crear el usuario admin:", err.message);
  // Salgo con código 1 para indicar que algo falló (código 0 sería éxito)
  process.exit(1);
});
