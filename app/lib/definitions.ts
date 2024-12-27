export type User = {
  id: string;
  documento: string;
  contraseña: string;
};

export type Trabajador = {
  id: number;
  documento: string;
  nombre: string;
  genero: string;
  fechaNacimiento: Date;
  cargo: string;
  eps: string;
  salario: number;
  ocupacion: string;
  tipoVinculacion: string;
  afp: string;
  jornada: string;
  contratacion: string;
};

export type Ausentismo = {
  id: number;
  trabajador_id: number;
  contingencia: string;
  fechaInicio: Date;
  fechaFinalizacion: Date;
  diasAusencia: number;
  valorAusentismo: string;
  proceso: string;
  factorPrestacional: string;
  observaciones: string;
};

export const contingencias = [
  "Accidente de Trabajo",
  "Ausencia no justificada",
  "Ausencia no Remunerada",
  "Enfermedad General",
  "Enfermedad Laboral",
  "Licencia de Maternidad con Hijos con Discapacidad",
  "Licencia de Maternidad Nacimiento Prematuro",
  "Licencia de Maternidad Parto Múltiple",
  "Licencia de Maternidad",
  "Licencia de Paternidad",
  "Licencia por Calamidad",
  "Licencia por Luto",
  "Otros permisos remunerados",
  "Permiso de Estudio",
  "Permiso por horas Día",
  "Suspeciones",
];

export const procesos = [
  "Alto Riesgo Obstétrico",
  "Auditoría de Cuentas Médicas",
  "Cartera",
  "Central de Esterilización",
  "Central de Gases Medicinales",
  "Comunicación e Imagen",
  "Consulta Externa",
  "Contabilidad",
  "Contratación y Convenios",
  "Control Interno Disciplinario",
  "Control Interno",
  "Costos",
  "Docencia Servicio",
  "Epidemiología",
  "Equipo Psicosocial",
  "Estadística",
  "Facturación",
  "Gestión Ambiental",
  "Gestión Clínica",
  "Gestión de Suministros",
  "Gestión de Talento Humano",
  "Gestión Documental",
  "Gestión Gerencial",
  "Gestión Jurídica",
  "Hospitalización",
  "Imágenes Diagnósticas",
  "Innovación",
  "Investigación",
  "Laboratorio Clínico y Patología",
  "Mantenimiento e Infraestructura",
  "Movilidad del Paciente",
  "Nutrición y Dietética",
  "Planeación",
  "Presupuesto",
  "PYM",
  "Referencia y Contrarreferencia",
  "Seguridad del Paciente e Infecciones",
  "Seguridad y Salud en el Trabajo",
  "Servicio de Cirugía",
  "Servicio Farmacéutico",
  "Servicios Generales",
  "SIAU",
  "Sistema Gestión de la Calidad",
  "Tecnogía Industrial",
  "Tecnología Biomédica",
  "Tecnología Sistemas",
  "Tecnologías de la información y las comunicaciones",
  "Terapia del Lenguaje",
  "Terapia Física",
  "Terapia Respiratoria",
  "Tesorería",
  "UCI Adultos",
  "UCI Neonatal",
  "UCI Pediátrica",
  "Unidad Renal",
  "Urgencias",
];
