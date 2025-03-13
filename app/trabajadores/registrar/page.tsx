import Link from "next/link"; // Importa el componente Link de Next.js para la navegación entre páginas
import { registrarTrabajador } from "../../lib/actions"; // Importa la función registrarTrabajador desde el archivo de acciones

// Componente principal de la página de registro de trabajadores
export default function Page() {
  const registrarTrabajadorIndividual = registrarTrabajador.bind(
    null,
    "individual"
  );
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Contenedor principal con estilos para centrar el contenido */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        {/* Título de la página */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Registrar Trabajador
        </h2>
        {/* Formulario de registro */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          action={registrarTrabajadorIndividual}
        >
          {/* Campo para el documento del trabajador */}
          <div>
            <label className="block text-gray-700">
              Documento del Trabajador
            </label>
            <input
              id="documento"
              name="documento"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para el nombre del trabajador */}
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para el género del trabajador */}
          <div>
            <label className="block text-gray-700">Genero</label>
            <select
              id="genero"
              name="genero"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={""}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
          {/* Campo para la fecha de nacimiento del trabajador */}
          <div>
            <label className="block text-gray-700">Fecha de Nacimiento</label>
            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para el cargo del trabajador */}
          <div>
            <label className="block text-gray-700">Cargo</label>
            <input
              id="cargo"
              name="cargo"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para la EPS del trabajador */}
          <div>
            <label className="block text-gray-700">EPS</label>
            <input
              id="eps"
              name="eps"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para el salario del trabajador */}
          <div>
            <label className="block text-gray-700">Salario</label>
            <input
              id="salario"
              name="salario"
              type="number"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para la ocupación CIUO del trabajador */}
          <div>
            <label className="block text-gray-700">Ocupación CIUO</label>
            <input
              id="ocupacion"
              name="ocupacion"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para el tipo de vinculación del trabajador */}
          <div>
            <label className="block text-gray-700">Tipo Vinculación</label>
            <input
              id="tipoVinculacion"
              name="tipoVinculacion"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para la AFP del trabajador */}
          <div>
            <label className="block text-gray-700">AFP</label>
            <input
              id="afp"
              name="afp"
              type="text"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          {/* Campo para la jornada del trabajador */}
          <div>
            <label className="block text-gray-700">Jornada</label>
            <select
              id="jornada"
              name="jornada"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={""}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option>Administrativo</option>
              <option>Asistencial</option>
            </select>
          </div>
          {/* Campo para el tipo de contratación del trabajador */}
          <div>
            <label className="block text-gray-700">Contratación</label>
            <select
              id="contratacion"
              name="contratacion"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={""}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option>Planta</option>
              <option>Tercero</option>
            </select>
          </div>
          {/* Botones de acción: Registrar y Regresar */}
          <div className="md:col-span-2 flex justify-between">
            <button
              type="submit"
              className="md:w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mr-2"
            >
              Registrar
            </button>
            <Link
              href={`/trabajadores`}
              className="md:w-1/2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 ml-2 text-center"
            >
              Regresar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
