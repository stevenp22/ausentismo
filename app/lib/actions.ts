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
import { CreateAusentismo, CreateTrabajador } from "./zod";
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
  CreateAusentismo.parse(rawFormData);
  const fechaInicio = new Date(rawFormData.fechaInicio as string);
  fechaInicio.setDate(fechaInicio.getDate() + 1);
  const fechaFinalizacion = new Date(rawFormData.fechaFinalizacion as string);
  fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 1);
  try {
    await registrarAusentismoDB(
      Number(rawFormData.trabajador_id),
      rawFormData.contingencia as string,
      fechaInicio,
      fechaFinalizacion,
      Number(rawFormData.diasAusencia),
      rawFormData.valorAusentismo as string,
      rawFormData.proceso as string,
      rawFormData.factorPrestacional as string,
      rawFormData.observaciones as string
    );
  } catch (error) {
    console.log("Error al registrar ausentismo del trabajador", error);
    throw new Error("Error al registrar ausentismo del trabajador");
  }
  revalidatePath("/trabajadores");
  redirect("/trabajadores");
}
