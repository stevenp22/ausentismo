"use server"; // Indica que este archivo se ejecuta en el servidor

import { signIn } from "@/auth"; // Importa la función signIn desde el módulo de autenticación
import { AuthError } from "next-auth"; // Importa la clase AuthError desde next-auth

// Importa varias funciones y tipos desde el módulo data
import {
  actualizarTrabajadorDB,
  buscarAusentismoDB,
  buscarTrabajadorDB,
  buscarTrabajadorIdDB,
  registrarAusentismoDB,
  registrarTrabajadorDB,
  usuario,
} from "./data";

// Importa varios esquemas de validación desde el módulo zod
import {
  CreateTrabajador,
  CreateAusentismoMaternidad,
  CreateAusentismoDiagnostico,
  CreateAusentismoNo,
  CreateAusentismoHoras,
  CreateAusentismoMaternidadFraccionada,
  CreateAusentismoMaternidadPrematuro,
  CreateAusentismoMaternidadFraccionadaPrematuro,
} from "./zod";

import { revalidatePath } from "next/cache"; // Importa la función revalidatePath desde next/cache
import { redirect } from "next/navigation"; // Importa la función redirect desde next/navigation
import { Ausentismo, Trabajador } from "./definitions"; // Importa los tipos Ausentismo y Trabajador desde el módulo definitions

// Función para autenticar al usuario
export async function authenticate(
  prevState: string | undefined, // Estado previo de la autenticación
  formData: FormData // Datos del formulario de autenticación
) {
  try {
    await signIn("credentials", formData); // Intenta iniciar sesión con las credenciales proporcionadas
  } catch (error) {
    if (error instanceof AuthError) {
      // Si ocurre un error de autenticación
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."; // Retorna un mensaje de error si las credenciales son inválidas
        default:
          return "Something went wrong."; // Retorna un mensaje de error genérico para otros tipos de errores
      }
    }
    throw error; // Lanza el error si no es un AuthError
  }
}

// Función para buscar un usuario por su documento
export async function buscarUsuario(documento: string) {
  try {
    const resultado = await usuario(documento); // Busca el usuario en la base de datos
    console.log("Resultado de la busqueda de usuarios", resultado); // Imprime el resultado en la consola
    return resultado; // Retorna el resultado de la búsqueda
  } catch (error) {
    console.log("Error al buscar usuario", error); // Imprime el error en la consola
  }
}

// Función para registrar un trabajador
export async function registrarTrabajador(tipo: string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries()); // Convierte los datos del formulario a un objeto
  CreateTrabajador.parse(rawFormData); // Valida los datos del formulario
  const fechaNacimiento = new Date(rawFormData.fechaNacimiento as string); // Convierte la fecha de nacimiento a un objeto Date
  fechaNacimiento.setDate(fechaNacimiento.getDate() + 1); // Ajusta la fecha de nacimiento
  try {
    await registrarTrabajadorDB(
      rawFormData.documento as string,
      rawFormData.nombre as string,
      rawFormData.genero as string,
      fechaNacimiento,
      rawFormData.cargo as string,
      rawFormData.eps as string,
      Number(rawFormData.salario),
      rawFormData.ocupacion as string,
      rawFormData.tipoVinculacion as string,
      rawFormData.afp as string,
      rawFormData.jornada as string,
      rawFormData.contratacion as string
    ); // Registra el trabajador en la base de datos
  } catch (error) {
    console.log("Error al registrar trabajador", error); // Imprime el error en la consola
    throw new Error("Error al registrar trabajador"); // Lanza un error si ocurre un problema
  }
  if (tipo === "individual") {
    revalidatePath("/trabajadores"); // Revalida la ruta de trabajadores
    redirect("/trabajadores"); // Redirige a la página de trabajadores
  }
}

// Función para buscar un trabajador por su documento
export async function buscarTrabajador(documento: string) {
  try {
    const resultado = await buscarTrabajadorDB(documento); // Busca el trabajador en la base de datos
    console.log("Resultado de la busqueda de trabajadores", resultado); // Imprime el resultado en la consola
    return resultado; // Retorna el resultado de la búsqueda
  } catch (error) {
    console.log("Error al buscar trabajador", error); // Imprime el error en la consola
    throw new Error("Error al buscar trabajador"); // Lanza un error si ocurre un problema
  }
}

// Función para buscar un trabajador por su ID
export async function buscarTrabajadorId(id: string) {
  try {
    const resultado = await buscarTrabajadorIdDB(id); // Busca el trabajador en la base de datos por ID
    return resultado; // Retorna el resultado de la búsqueda
  } catch (error) {
    console.log("Error al buscar trabajador", error); // Imprime el error en la consola
    throw new Error("Error al buscar trabajador"); // Lanza un error si ocurre un problema
  }
}

// Función para actualizar un trabajador
export async function actualizarTrabajador(id: number, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries()); // Convierte los datos del formulario a un objeto
  CreateTrabajador.parse(rawFormData); // Valida los datos del formulario
  const fechaNacimiento = new Date(rawFormData.fechaNacimiento as string); // Convierte la fecha de nacimiento a un objeto Date
  fechaNacimiento.setDate(fechaNacimiento.getDate() + 1); // Ajusta la fecha de nacimiento
  try {
    await actualizarTrabajadorDB(
      id,
      rawFormData.documento as string,
      rawFormData.nombre as string,
      rawFormData.genero as string,
      fechaNacimiento,
      rawFormData.cargo as string,
      rawFormData.eps as string,
      Number(rawFormData.salario),
      rawFormData.ocupacion as string,
      rawFormData.tipoVinculacion as string,
      rawFormData.afp as string,
      rawFormData.jornada as string,
      rawFormData.contratacion as string
    ); // Actualiza el trabajador en la base de datos
  } catch (error) {
    console.log("Error al actualizar trabajador", error); // Imprime el error en la consola
    throw new Error("Error al actualizar trabajador"); // Lanza un error si ocurre un problema
  }
  revalidatePath("/trabajadores"); // Revalida la ruta de trabajadores
  redirect("/trabajadores"); // Redirige a la página de trabajadores
}

// Función para registrar un ausentismo
export async function registrarAusentismo(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries()); // Convierte los datos del formulario a un objeto
  console.log(rawFormData); // Imprime los datos del formulario en la consola

  // Validación de los datos del formulario según el tipo de contingencia
  if (
    [
      "Accidente de trabajo",
      "Enfermedad General",
      "Enfermedad Laboral",
    ].includes(rawFormData.contingencia as string)
  ) {
    CreateAusentismoDiagnostico.parse(rawFormData);
  }
  if (
    [
      "Ausencia no justificada",
      "Ausencia no remunerada",
      "Licencia por Calamidad",
      "Licencia por Luto",
      "Otros permisos remunerados",
      "Permiso de Estudio",
      "Suspenciones",
    ].includes(rawFormData.contingencia as string)
  ) {
    CreateAusentismoNo.parse(rawFormData);
  }
  if (["Permiso por horas Día"].includes(rawFormData.contingencia as string)) {
    CreateAusentismoHoras.parse(rawFormData);
  }
  if (
    [
      "Licencia de Maternidad",
      "Licencia de Maternidad Parto Múltiple",
      "Licencia de Maternidad Nacimiento Prematuro",
      "Licencia de Maternidad con Hijos con Discapacidad",
    ].includes(rawFormData.contingencia as string) &&
    (rawFormData.prematuro as string) === "false" &&
    (rawFormData.licenciaFraccionada as string) === "0"
  ) {
    CreateAusentismoMaternidad.parse(rawFormData);
  }
  if (
    [
      "Licencia de Maternidad",
      "Licencia de Maternidad Parto Múltiple",
      "Licencia de Maternidad Nacimiento Prematuro",
      "Licencia de Maternidad con Hijos con Discapacidad",
    ].includes(rawFormData.contingencia as string) &&
    (rawFormData.prematuro as string) === "false" &&
    (rawFormData.licenciaFraccionada as string) > "0"
  ) {
    CreateAusentismoMaternidadFraccionada.parse(rawFormData);
  }
  if (
    [
      "Licencia de Maternidad",
      "Licencia de Maternidad Parto Múltiple",
      "Licencia de Maternidad Nacimiento Prematuro",
      "Licencia de Maternidad con Hijos con Discapacidad",
    ].includes(rawFormData.contingencia as string) &&
    (rawFormData.prematuro as string) === "true" &&
    (rawFormData.licenciaFraccionada as string) === "0"
  ) {
    CreateAusentismoMaternidadPrematuro.parse(rawFormData);
  }
  if (
    [
      "Licencia de Maternidad",
      "Licencia de Maternidad Parto Múltiple",
      "Licencia de Maternidad Nacimiento Prematuro",
      "Licencia de Maternidad con Hijos con Discapacidad",
    ].includes(rawFormData.contingencia as string) &&
    (rawFormData.prematuro as string) === "true" &&
    (rawFormData.licenciaFraccionada as string) > "0"
  ) {
    CreateAusentismoMaternidadFraccionadaPrematuro.parse(rawFormData);
  }

  // Conversión y validación de fechas
  const fechaNacimiento = new Date(rawFormData.fechaNacimiento as string);
  fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
  const fechaInicioPreparto = new Date(
    rawFormData.fechaInicioPreparto as string
  );
  fechaInicioPreparto.setDate(fechaInicioPreparto.getDate() + 1);
  const fechaFinPreparto = new Date(rawFormData.fechaFinPreparto as string);
  fechaFinPreparto.setDate(fechaFinPreparto.getDate() + 1);
  if (fechaInicioPreparto > fechaFinPreparto) {
    throw new Error(
      "La fecha de inicio del preparto no puede ser mayor a la de finalización"
    );
  }
  const fechaInicioPosparto = new Date(
    rawFormData.fechaInicioPosparto as string
  );
  fechaInicioPosparto.setDate(fechaInicioPosparto.getDate() + 1);
  const fechaFinPosparto = new Date(rawFormData.fechaFinPosparto as string);
  fechaFinPosparto.setDate(fechaFinPosparto.getDate() + 1);
  if (fechaInicioPosparto > fechaFinPosparto) {
    throw new Error(
      "La fecha de inicio del posparto no puede ser mayor a la de finalización"
    );
  }
  const fechaInicio = new Date(rawFormData.fechaInicio as string);
  fechaInicio.setDate(fechaInicio.getDate() + 1);
  const fechaFinalizacion = new Date(rawFormData.fechaFinalizacion as string);
  fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 1);
  if (fechaInicio > fechaFinalizacion) {
    throw new Error(
      "La fecha de inicio no puede ser mayor a la de finalización"
    );
  }
  const fechaRegistro = new Date().toISOString().split("T")[0];
  console.log("Fecha de registro", fechaRegistro);

  // Registro del ausentismo en la base de datos
  try {
    await registrarAusentismoDB(
      Number(rawFormData.trabajador_id),
      rawFormData.contingencia as string,
      rawFormData.diagnosticoCIE10 as string,
      Number(rawFormData.licenciaFraccionada),
      rawFormData.prematuro as string,
      Number(rawFormData.semanasGestacion),
      fechaNacimiento,
      fechaInicioPreparto,
      fechaFinPreparto,
      fechaInicioPosparto,
      fechaFinPosparto,
      fechaInicio,
      fechaFinalizacion,
      Number(rawFormData.horaInicio),
      Number(rawFormData.horaFinalizacion),
      Number(rawFormData.diasAusencia),
      rawFormData.valorAusentismo as string,
      rawFormData.proceso as string,
      Number(rawFormData.factorPrestacional),
      rawFormData.observaciones as string,
      fechaRegistro
    );
  } catch (error) {
    console.log("Error al registrar ausentismo del trabajador", error);
    throw new Error("Error al registrar ausentismo del trabajador");
  }
  revalidatePath("/trabajadores");
  redirect("/trabajadores");
}

// Función para buscar ausentismos por ID de trabajador
export async function buscarAusentismo(id: number): Promise<Ausentismo[]> {
  try {
    const resultado = (await buscarAusentismoDB(id)) as Ausentismo[];
    console.log("Resultado de la busqueda de ausencias", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al buscar trabajador", error);
    throw new Error("Error al buscar trabajador");
  }
}
