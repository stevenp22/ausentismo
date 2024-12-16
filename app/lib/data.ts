import mysql from "mysql2/promise";
import { User } from "./definitions";

const mySqlConfig = {
  user: process.env.MYSQL_USERNAME || "",
  password: process.env.MYSQL_PASSWORD || "",
  host: process.env.MYSQL_HOST || "",
  port: parseInt(process.env.MYSQL_PORT || ""),
  database: process.env.MYSQL_DATABASE || "",
};

export async function usuario(documento: string): Promise<User | undefined> {
  const connection = await mysql.createConnection(mySqlConfig);
  try {
    const [results] = await connection.query(
      "SELECT * FROM Usuarios WHERE documento = ?",
      [documento]
    );
    const resultados = results as User[];
    return resultados[0];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function registrarTrabajadorDB(
  documento: string,
  nombre: string,
  genero: string,
  fechaNacimiento: Date,
  cargo: string,
  eps: string,
  salario: number,
  ocupacion: string,
  tipoVinculacion: string,
  afp: string,
  jornada: string,
  contratacion: string
) {
  const connection = await mysql.createConnection(mySqlConfig);
  await connection.query(
    "INSERT INTO Trabajadores (documento, nombre, genero, fechaNacimiento, cargo, eps, salario, ocupacion, tipoVinculacion, afp, jornada, contratacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      documento,
      nombre,
      genero,
      fechaNacimiento,
      cargo,
      eps,
      salario,
      ocupacion,
      tipoVinculacion,
      afp,
      jornada,
      contratacion,
    ]
  );
  if (connection) {
    await connection.end();
  }
}
