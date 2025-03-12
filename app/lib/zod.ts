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
  jornada: z.enum(["Administrativo", "Asistencial"]),
  contratacion: z.enum(["Planta", "Tercero"]),
});

export const CreateTrabajador = FormSchemaTrabajador.omit({ id: true });

const FormSchemaAusentismo = z.object({
  id: z.coerce.number(),
  trabajador_id: z.coerce.number(),
  contingencia: z.string().nonempty("Contingencia no puede estar vacía"),
  diagnosticoCIE10: z.string(),
  licenciaFraccionada: z.coerce.number().min(0).max(2),
  prematuro: z.boolean(),
  semanasGestacion: z.coerce.number().min(24).max(37),
  fechaNacimiento: z.string(),
  fechaInicioPreparto: z.string(),
  fechaFinPreparto: z.string(),
  fechaInicioPosparto: z.string(),
  fechaFinPosparto: z.string(),
  fechaInicio: z.string(),
  fechaFinalizacion: z.string(),
  horaInicio: z.string(),
  horaFinalizacion: z.string(),
  diasAusencia: z.coerce.number(),
  valorAusentismo: z.string(),
  proceso: z.string(),
  factorPrestacional: z.coerce.number(),
  observaciones: z.string(),
  fechaRegistro: z.string(),
});

export const CreateAusentismo = FormSchemaAusentismo.omit({ id: true });
export const CreateAusentismoDiagnostico = FormSchemaAusentismo.omit({
  id: true,
  licenciaFraccionada: true,
  prematuro: true,
  semanasGestacion: true,
  fechaNacimiento: true,
  fechaInicioPreparto: true,
  fechaFinPreparto: true,
  fechaInicioPosparto: true,
  fechaFinPosparto: true,
  horaInicio: true,
  horaFinalizacion: true,
});
export const CreateAusentismoNo = FormSchemaAusentismo.omit({
  id: true,
  diagnosticoCIE10: true,
  licenciaFraccionada: true,
  prematuro: true,
  semanasGestacion: true,
  fechaNacimiento: true,
  fechaInicioPreparto: true,
  fechaFinPreparto: true,
  fechaInicioPosparto: true,
  fechaFinPosparto: true,
  horaInicio: true,
  horaFinalizacion: true,
});
export const CreateAusentismoHoras = FormSchemaAusentismo.omit({
  id: true,
  diagnosticoCIE10: true,
  licenciaFraccionada: true,
  prematuro: true,
  semanasGestacion: true,
  fechaNacimiento: true,
  fechaInicioPreparto: true,
  fechaFinPreparto: true,
  fechaInicioPosparto: true,
  fechaFinPosparto: true,
});
export const CreateAusentismoMaternidad = FormSchemaAusentismo.omit({
  id: true,
  diagnosticoCIE10: true,
  prematuro: true,
  semanasGestacion: true,
  fechaNacimiento: true,
  fechaInicioPreparto: true,
  fechaFinPreparto: true,
  fechaInicioPosparto: true,
  fechaFinPosparto: true,
  horaInicio: true,
  horaFinalizacion: true,
});
export const CreateAusentismoMaternidadFraccionada = FormSchemaAusentismo.omit({
  id: true,
  diagnosticoCIE10: true,
  prematuro: true,
  semanasGestacion: true,
  fechaInicio: true,
  fechaFinalizacion: true,
  horaInicio: true,
  horaFinalizacion: true,
});
export const CreateAusentismoMaternidadPrematuro = FormSchemaAusentismo.omit({
  id: true,
  diagnosticoCIE10: true,
  fechaInicioPreparto: true,
  fechaFinPreparto: true,
  fechaInicioPosparto: true,
  fechaFinPosparto: true,
  horaInicio: true,
  horaFinalizacion: true,
});
export const CreateAusentismoMaternidadFraccionadaPrematuro =
  FormSchemaAusentismo.omit({
    id: true,
    diagnosticoCIE10: true,
    licenciaFraccionada: true,
    prematuro: true,
    semanasGestacion: true,
    fechaNacimiento: true,
    fechaInicioPreparto: true,
    fechaFinPreparto: true,
    fechaInicioPosparto: true,
    fechaFinPosparto: true,
    horaInicio: true,
    horaFinalizacion: true,
  });
