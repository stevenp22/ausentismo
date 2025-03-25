import {
  actualizarTrabajador,
  buscarTrabajadorId,
} from "@/app/lib/actions";
import Link from "next/link";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const trabajador = await buscarTrabajadorId(id);
  const actualizarTrabajadorConId = actualizarTrabajador.bind(
    null,
    trabajador.id
  );
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Registrar Trabajador
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          action={actualizarTrabajadorConId}
        >
          <div>
            <label className="block text-gray-700">
              Documento del Trabajador
            </label>
            <input
              id="documento"
              name="documento"
              type="text"
              defaultValue={trabajador.documento}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              defaultValue={trabajador.nombre}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Genero</label>
            <select
              id="genero"
              name="genero"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={trabajador.genero}
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
          <div>
            <label className="block text-gray-700">Fecha de Nacimiento</label>
            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              defaultValue={
                trabajador.fechaNacimiento.toISOString().split("T")[0]
              }
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Cargo</label>
            <input
              id="cargo"
              name="cargo"
              type="text"
              defaultValue={trabajador.cargo}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">EPS</label>
            <input
              id="eps"
              name="eps"
              type="text"
              defaultValue={trabajador.eps}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Salario</label>
            <input
              id="salario"
              name="salario"
              type="number"
              defaultValue={trabajador.salario}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Ocupación CIUO</label>
            <input
              id="ocupacion"
              name="ocupacion"
              type="text"
              defaultValue={trabajador.ocupacion}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Tipo Vinculación</label>
            <input
              id="tipoVinculacion"
              name="tipoVinculacion"
              type="text"
              defaultValue={trabajador.tipoVinculacion}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">AFP</label>
            <input
              id="afp"
              name="afp"
              type="text"
              defaultValue={trabajador.afp}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Jornada</label>
            <select
              id="jornada"
              name="jornada"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={trabajador.jornada}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option>Oficina</option>
              <option>Turnos</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Contratación</label>
            <select
              id="contratacion"
              name="contratacion"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={trabajador.contratacion}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option>Planta</option>
              <option>Activos</option>
            </select>
          </div>
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
