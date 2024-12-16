"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { registrarTrabajadorDB, usuario } from "./data";
import { CreateTrabajador } from "./zod";
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
  const firstKey = Object.keys(rawFormData)[0];
  if (firstKey) {
    delete rawFormData[firstKey];
  }
  CreateTrabajador.parse(rawFormData);
  //console.log(rawFormData);
  const fechaNacimiento = new Date(rawFormData.fechaNacimiento as string);
  fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
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
}
