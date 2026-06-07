import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME,

  options: {
    trustServerCertificate: true,
  },

  authentication: {
    type: "ntlm",
    options: {
      domain: "",
      userName: "",
      password: "",
    },
  },
};

export const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Base de datos conectada");
  } catch (error) {
    console.error(error);
  }
};

export default sql;