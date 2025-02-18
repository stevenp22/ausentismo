"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import {
  actualizarTrabajadorDB,
  buscarTrabajadorDB,
  buscarTrabajadorIdDB,
  registrarAusentismoDB,
  registrarTrabajadorDB,
  usuario,
} from "./data";
import {
  CreateAusentismo,
  CreateTrabajador,
  CreateAusentismoMaternidad,
  CreateAusentismoDiagnostico,
  CreateAusentismoNo,
  CreateAusentismoHoras,
  CreateAusentismoMaternidadFraccionada,
  CreateAusentismoMaternidadPrematuro,
  CreateAusentismoMaternidadFraccionadaPrematuro,
} from "./zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function buscarUsuario(documento: string) {
  try {
    const resultado = await usuario(documento);
    console.log("Resultado de la busqueda de usuarios", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al buscar usuario", error);
  }
}

export async function registrarTrabajador(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  CreateTrabajador.parse(rawFormData);
  const fechaNacimiento = new Date(rawFormData.fechaNacimiento as string);
  fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
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
    );
  } catch (error) {
    console.log("Error al registrar trabajador", error);
    throw new Error("Error al registrar trabajador");
  }
  revalidatePath("/trabajadores");
  redirect("/trabajadores");
}

export async function buscarTrabajador(documento: string) {
  try {
    const resultado = await buscarTrabajadorDB(documento);
    console.log("Resultado de la busqueda de trabajadores", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al buscar trabajador", error);
    throw new Error("Error al buscar trabajador");
  }
}

export async function buscarTrabajadorId(id: string) {
  try {
    const resultado = await buscarTrabajadorIdDB(id);
    //console.log("Resultado de la busqueda de trabajadores", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al buscar trabajador", error);
    throw new Error("Error al buscar trabajador");
  }
}

export async function actualizarTrabajador(id: number, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  CreateTrabajador.parse(rawFormData);
  const fechaNacimiento = new Date(rawFormData.fechaNacimiento as string);
  fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
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
    );
  } catch (error) {
    console.log("Error al actualizar trabajador", error);
    throw new Error("Error al actualizar trabajador");
  }
  revalidatePath("/trabajadores");
  redirect("/trabajadores");
}

export async function registrarAusentismo(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  console.log(rawFormData);
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
