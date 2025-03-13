import mysql from "mysql2/promise"; // Importa el módulo mysql2/promise para manejar conexiones a MySQL de manera asíncrona
import { Trabajador, User } from "./definitions"; // Importa las definiciones de tipos Trabajador y User

// Configuración de la conexión a MySQL utilizando variables de entorno
const mySqlConfig = {
  user: process.env.MYSQL_USERNAME || "", // Usuario de la base de datos
  password: process.env.MYSQL_PASSWORD || "", // Contraseña de la base de datos
  host: process.env.MYSQL_HOST || "", // Host de la base de datos
  port: parseInt(process.env.MYSQL_PORT || ""), // Puerto de la base de datos
  database: process.env.MYSQL_DATABASE || "", // Nombre de la base de datos
};

// Función para obtener un usuario por su documento
export async function usuario(documento: string): Promise<User | undefined> {
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
    const [results] = await connection.query(
      "SELECT * FROM Usuarios WHERE documento = ?",
      [documento]
    ); // Ejecuta la consulta para obtener el usuario por documento
    const resultados = results as User[]; // Convierte los resultados a un array de User
    return resultados[0]; // Retorna el primer usuario encontrado
  } catch (error) {
    console.error("Failed to fetch users:", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Failed to fetch users."); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}

// Función para registrar un trabajador en la base de datos
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
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
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
    ); // Ejecuta la consulta para insertar un nuevo trabajador
  } catch (error) {
    console.log("Error al registrar trabajador", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Error al registrar trabajador"); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}

// Función para buscar un trabajador por su documento
export async function buscarTrabajadorDB(documento: string) {
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
    const [results] = await connection.query(
      "SELECT * FROM Trabajadores WHERE documento = ?",
      [documento]
    ); // Ejecuta la consulta para obtener el trabajador por documento
    const resultados = results as Trabajador[]; // Convierte los resultados a un array de Trabajador
    return resultados[0]; // Retorna el primer trabajador encontrado
  } catch (error) {
    console.log("Error al buscar trabajador", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Error al buscar trabajador"); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}

// Función para buscar un trabajador por su ID
export async function buscarTrabajadorIdDB(id: string) {
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
    const [results] = await connection.query(
      "SELECT * FROM Trabajadores WHERE id = ?",
      [id]
    ); // Ejecuta la consulta para obtener el trabajador por ID
    const resultados = results as Trabajador[]; // Convierte los resultados a un array de Trabajador
    return resultados[0]; // Retorna el primer trabajador encontrado
  } catch (error) {
    console.log("Error al buscar trabajador", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Error al buscar trabajador"); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}

// Función para actualizar los datos de un trabajador
export async function actualizarTrabajadorDB(
  id: number,
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
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
    await connection.query(
      "UPDATE Trabajadores SET documento = ?, nombre = ?, genero = ?, fechaNacimiento = ?, cargo = ?, eps = ?, salario = ?, ocupacion = ?, tipoVinculacion = ?, afp = ?, jornada = ?, contratacion = ? WHERE id = ?",
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
        id,
      ]
    ); // Ejecuta la consulta para actualizar los datos del trabajador
  } catch (error) {
    console.log("Error al actualizar trabajador", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Error al actualizar trabajador"); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}

// Función para registrar un ausentismo en la base de datos
export async function registrarAusentismoDB(
  trabajador_id: number,
  contingencia: string,
  diagnosticoCIE10: string,
  licenciaFraccionada: number,
  prematuro: string,
  semanasGestacion: number,
  fechaNacimiento: Date,
  fechaInicioPreparto: Date,
  fechaFinPreparto: Date,
  fechaInicioPosparto: Date,
  fechaFinPosparto: Date,
  fechaInicio: Date,
  fechaFinalizacion: Date,
  horaInicio: number,
  horaFinalizacion: number,
  diasAusencia: number,
  valorAusentismo: string,
  proceso: string,
  factorPrestacional: number,
  observaciones: string,
  fechaRegistro: string
) {
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
    await connection.query(
      "INSERT INTO Ausentismo (trabajador_id, contingencia, diagnosticoCIE10, licenciaFraccionada, prematuro, semanasGestacion, fechaNacimiento, fechaInicioPreparto, fechaFinPreparto, fechaInicioPosparto, fechaFinPosparto, fechaInicio, fechaFinalizacion, horaInicio, horaFinalizacion, diasAusencia, valorAusentismo, proceso, factorPrestacional, observaciones, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        trabajador_id,
        contingencia,
        diagnosticoCIE10,
        licenciaFraccionada,
        prematuro,
        semanasGestacion,
        fechaNacimiento,
        fechaInicioPreparto,
        fechaFinPreparto,
        fechaInicioPosparto,
        fechaFinPosparto,
        fechaInicio,
        fechaFinalizacion,
        horaInicio,
        horaFinalizacion,
        diasAusencia,
        valorAusentismo,
        proceso,
        factorPrestacional,
        observaciones,
        fechaRegistro,
      ]
    ); // Ejecuta la consulta para insertar un nuevo ausentismo
  } catch (error) {
    console.log("Error al registrar ausentismo", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Error al registrar ausentimos"); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}

// Función para buscar ausentismos por el ID del trabajador
export async function buscarAusentismoDB(id: number) {
  const connection = await mysql.createConnection(mySqlConfig); // Crea una conexión a la base de datos
  try {
    const [results] = await connection.query(
      "SELECT * FROM Ausentismo WHERE trabajador_id = ?",
      [id]
    ); // Ejecuta la consulta para obtener los ausentismos por ID del trabajador
    return results; // Retorna los resultados de la consulta
  } catch (error) {
    console.log("Error al buscar ausentismo", error); // Muestra un error en la consola si la consulta falla
    throw new Error("Error al buscar ausentismo"); // Lanza un error
  } finally {
    if (connection) {
      await connection.end(); // Cierra la conexión a la base de datos
    }
  }
}
