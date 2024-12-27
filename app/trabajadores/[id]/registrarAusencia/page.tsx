"use client";
import { buscarTrabajadorId, registrarAusentismo } from "@/app/lib/actions";
import Link from "next/link";
import { contingencias, procesos } from "@/app/lib/definitions";
import { useEffect, useRef, useState } from "react";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const fechaInicioRef = useRef<HTMLInputElement>(null);
  const fechaFinalizacionRef = useRef<HTMLInputElement>(null);
  const diasAusenciaRef = useRef<HTMLInputElement>(null);
  const valorAusentismoRef = useRef<HTMLInputElement>(null);
  const [factorPrestacional, setFactorPrestacional] = useState(1.0);
  const [warning, setWarning] = useState("");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const fetchParams = async () => {
      const params = await props.params;
      setId(params.id);
    };
    fetchParams();
  }, [props.params]);

  const handleFactorPrestacionalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 1.0) {
      setWarning("El factor prestacional debe ser mayor o igual a 1");
      setFactorPrestacional(1.0);
    } else {
      setWarning("");
      setFactorPrestacional(value);
    }
  };

  const calcularDiasAusencia = () => {
    if (!fechaInicioRef.current || !fechaFinalizacionRef.current) return;
    const fechaInicio = new Date(fechaInicioRef.current.value);
    const fechaFinalizacion = new Date(fechaFinalizacionRef.current.value);
    if (fechaInicio && fechaFinalizacion) {
      const diferenciaTiempo =
        fechaFinalizacion.getTime() - fechaInicio.getTime();
      const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
      if (diasAusenciaRef.current) {
        diasAusenciaRef.current.value = (
          diferenciaDias >= 0 ? diferenciaDias : 0
        ).toString();
      }
    }
  };

  const valor = async () => {
    const trabajador = await buscarTrabajadorId(id);
    const salario = trabajador.salario;
    const dias = diasAusenciaRef.current?.value;
    const factor = salario / 30;
    const valor = factor * Number(dias);
    const valorFactorPrestacional = valor * factorPrestacional;
    const valorFormateado = valorFactorPrestacional.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
    if (valorAusentismoRef.current) {
      valorAusentismoRef.current.value = valorFormateado.toString();
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
          <div>
            <label className="block text-gray-700">Fecha Inicio</label>
            <input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
              required
              ref={fechaInicioRef}
              onChange={calcularDiasAusencia}
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
              ref={fechaFinalizacionRef}
              onChange={calcularDiasAusencia}
              onBlur={valor}
            />
          </div>
          <div>
            <label className="block text-gray-700">Dias Ausencia</label>
            <input
              id="diasAusencia"
              name="diasAusencia"
              type="text"
              className="mt-1 block w-full border-2 rounded-md shadow-sm p-2 text-lg text-black bg-gray-200"
              required
              ref={diasAusenciaRef}
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
              ref={valorAusentismoRef}
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
              onChange={handleFactorPrestacionalChange}
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
