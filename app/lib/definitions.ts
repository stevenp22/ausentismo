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