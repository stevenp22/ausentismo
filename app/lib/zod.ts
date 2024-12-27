import { z } from "zod";

const FormSchemaTrabajador = z.object({
  id: z.coerce.number(),
  documento: z.string(),
  nombre: z.string(),
  genero: z.enum(["Masculino", "Femenino", "Otro"]),
  fechaNacimiento: z.string(),
  cargo: z.string(),
  eps: z.string(),
  salario: z.coerce.number(),
  ocupacion: z.string(),
  tipoVinculacion: z.string(),
  afp: z.string(),
  jornada: z.enum(["Oficina", "Turnos"]),
  contratacion: z.enum(["Planta", "Activos"]),
});

export const CreateTrabajador = FormSchemaTrabajador.omit({ id: true });

const FormSchemaAusentismo = z.object({
  id: z.coerce.number(),
  trabajador_id: z.coerce.number(),
  contingencia: z.string(),
  fechaInicio: z.string(),
  fechaFinalizacion: z.string(),
  diasAusencia: z.coerce.number(),
  valorAusentismo: z.string(),
  proceso: z.string(),
  factorPrestacional: z.coerce.number(),
  observaciones: z.string(),
});

export const CreateAusentismo = FormSchemaAusentismo.omit({ id: true });
