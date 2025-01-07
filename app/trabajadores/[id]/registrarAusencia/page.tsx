"use client";
import { buscarTrabajadorId, registrarAusentismo } from "@/app/lib/actions";
import Link from "next/link";
import { contingencias, procesos } from "@/app/lib/definitions";
import { useEffect, useState } from "react";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [diasAusencia, setDiasAusencia] = useState(0);
  const [valorAusentismo, setValorAusentismo] = useState("");
  const [factorPrestacional, setFactorPrestacional] = useState(1.0);
  const [warning, setWarning] = useState("");
  const [id, setId] = useState<string>("");
  const [salario, setSalario] = useState(0);
  const [contingencia, setContingencia] = useState("");
  const [licenciaFraccionada, setLicenciaFraccionada] = useState("");

  useEffect(() => {
    const fetchParams = async () => {
      const params = await props.params;
      const trabajador = await buscarTrabajadorId(params.id);
      setId(params.id);
      setSalario(trabajador.salario);
    };
    fetchParams();
  }, [props.params]);

  const calcularDiasAusencia = () => {
    if (!fechaInicio || !fechaFinalizacion) return;
    const fechaIni = new Date(fechaInicio);
    const fechaFinal = new Date(fechaFinalizacion);
    if (fechaIni && fechaFinal) {
      const diferenciaTiempo = fechaFinal.getTime() - fechaIni.getTime();
      const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
      if (diferenciaDias) {
        setDiasAusencia(diferenciaDias >= 0 ? diferenciaDias : 0);
        return diferenciaDias >= 0 ? diferenciaDias : 0;
      }
    }
  };

  const valor = async () => {
    const dias = await calcularDiasAusencia();
    const factor = salario / 30;
    const valor = dias ? factor * dias : 0;
    const valorFactorPrestacional = valor * factorPrestacional;
    const valorFormateado = valorFactorPrestacional.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
    if (valorFormateado) {
      setValorAusentismo(valorFormateado);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    if (e.target.name === "fechaInicio") {
      setFechaInicio(e.target.value);
    }
    if (e.target.name === "fechaFinalizacion") {
      setFechaFinalizacion(e.target.value);
    }
    if (e.target.name === "factorPrestacional") {
      const value = parseFloat(e.target.value);
      if (isNaN(value) || value < 1.0) {
        setWarning("El factor prestacional debe ser mayor o igual a 1");
        setFactorPrestacional(1.0);
      } else {
        setWarning("");
        setFactorPrestacional(value);
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    if (e.target.name === "contingencia") {
      setContingencia(e.target.value);
    }
    if (e.target.name === "licenciaFraccionada") {
      setLicenciaFraccionada(e.target.value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Registrar Ausentismo
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          action={registrarAusentismo}
        >
          <input type="hidden" name="trabajador_id" value={id} />
          <div className="md:col-span-2">
            <label className="block text-gray-700">Contingencia</label>
            <select
              id="contingencia"
              name="contingencia"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={""}
              required
              onChange={handleSelectChange}
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              {contingencias.map((contingencia) => (
                <option key={contingencia} value={contingencia}>
                  {contingencia}
                </option>
              ))}
            </select>
          </div>
          {[
            "Accidente de Trabajo",
            "Enfermedad General",
            "Enfermedad Laboral",
          ].includes(contingencia) && (
            <div>
              <label className="block text-gray-700">Diagnóstico CIE-10</label>
              <input
                id="diagnosticoCIE10"
                name="diagnosticoCIE10"
                type="text"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                required
              />
            </div>
          )}
          {["Licencia de Maternidad"].includes(contingencia) && (
            <div>
              <label className="block text-gray-700">
                Licencia Fraccionada
              </label>
              <select
                id="licenciaFraccionada"
                name="licenciaFraccionada"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                defaultValue={""}
                required
                onChange={handleSelectChange}
              >
                <option value="">No</option>
                <option value="1">1 Semana</option>
                <option value="2">2 Semanas</option>
              </select>
              <label className="block text-red-700">
                Las licencias de maternidad se registra conforme a lo definido
                en la Ley 2114 del 29 de Julio del 2021.
              </label>
            </div>
          )}
          <div>
            <label className="block text-gray-700">Fecha Inicio</label>
            <input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
              value={fechaInicio}
              onChange={handleInputChange}
              onBlur={valor}
            />
          </div>
          <div>
            <label className="block text-gray-700">Fecha Finalización</label>
            <input
              id="fechaFinalizacion"
              name="fechaFinalizacion"
              type="date"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
              value={fechaFinalizacion}
              onChange={handleInputChange}
              onBlur={valor}
            />
          </div>
          <div>
            <label className="block text-gray-700">Dias Ausencia</label>
            <input
              id="diasAusencia"
              name="diasAusencia"
              type="number"
              className="mt-1 block w-full border-2 rounded-md shadow-sm p-2 text-lg text-black bg-gray-200"
              required
              value={diasAusencia}
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700">Valor Ausentismo</label>
            <input
              id="valorAusentismo"
              name="valorAusentismo"
              type="text"
              className="mt-1 block w-full border-2 rounded-md shadow-sm p-2 text-lg text-black bg-gray-200"
              value={valorAusentismo}
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700">Proceso</label>
            <select
              id="proceso"
              name="proceso"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              defaultValue={""}
              required
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              {procesos.map((proceso) => (
                <option key={proceso} value={proceso}>
                  {proceso}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Factor Prestacional</label>
            <input
              id="factorPrestacional"
              name="factorPrestacional"
              type="number"
              value={factorPrestacional}
              onChange={handleInputChange}
              onBlur={valor}
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              min="1"
              step="0.01"
              required
            />
            {warning && <p className="text-red-500">{warning}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              className="mt-1 block w-full h-32 border-2 border-black rounded-md shadow-sm p-4 text-lg text-black align-text-top"
              required
            ></textarea>
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
