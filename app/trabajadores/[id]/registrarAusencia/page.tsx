"use client";
import { buscarTrabajadorId, registrarAusentismo } from "@/app/lib/actions";
import Link from "next/link";
import { contingencias, procesos } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import Modal from "react-modal";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [isFechaInicioDisabled, setIsFechaInicioDisabled] = useState(false);
  const [fechaFinalizacion, setFechaFinalizacion] = useState("");
  const [isFechaFinalizacionDisabled, setIsFechaFinalizacionDisabled] =
    useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [fechaInicioPreparto, setFechaInicioPreparto] = useState("");
  const [fechaFinPreparto, setFechaFinPreparto] = useState("");
  const [fechaInicioPosparto, setFechaInicioPosparto] = useState("");
  const [fechaFinPosparto, setFechaFinPosparto] = useState("");
  const [diasAusencia, setDiasAusencia] = useState(0);
  const [valorAusentismo, setValorAusentismo] = useState("");
  const [factorPrestacional, setFactorPrestacional] = useState(1.0);
  const [id, setId] = useState<string>("");
  const [salario, setSalario] = useState(0);
  const [contingencia, setContingencia] = useState("");
  const [licenciaFraccionada, setLicenciaFraccionada] = useState(0);
  const [prematuro, setPrematuro] = useState(false);
  const [semanasGestacion, setSemanasGestacion] = useState(24);
  const [showModal, setShowModal] = useState(false);

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
    if (licenciaFraccionada > 0) return;
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
    if (e.target.name === "fechaInicio") {
      if (new Date(e.target.value).getTime() > Date.now()) {
        alert("La fecha de inicio no puede ser mayor a la fecha actual");
        setFechaInicio("");
        return;
      }
      if (["Licencia de Maternidad"].includes(contingencia)) {
        const fechaInicioDate = new Date(e.target.value);
        const nuevaFechaFinalizacion = addDays(fechaInicioDate, 126);
        setFechaFinalizacion(
          nuevaFechaFinalizacion.toISOString().split("T")[0]
        );
        setIsFechaFinalizacionDisabled(true);
        return;
      } else {
        setIsFechaFinalizacionDisabled(false);
      }
      if (e.target.value > fechaFinalizacion && fechaFinalizacion) {
        alert(
          "La fecha de inicio no puede ser mayor a la fecha de finalización"
        );
        setFechaInicio("");
        return;
      }
      setFechaInicio(e.target.value);
    }
    if (e.target.name === "fechaFinalizacion") {
      if (fechaInicio > e.target.value && fechaInicio) {
        alert(
          "La fecha de inicio no puede ser mayor a la fecha de finalización"
        );
        setFechaFinalizacion("");
        return;
      }
      setFechaFinalizacion(e.target.value);
      return;
    }
    if (e.target.name === "fechaNacimiento") {
      setFechaNacimiento(e.target.value);
      if (licenciaFraccionada > 0 && !prematuro) {
        const factor = -7 * licenciaFraccionada;
        const fechaNacimientoDate = new Date(e.target.value);
        const nuevaFechaInicioPreparto = addDays(fechaNacimientoDate, factor);
        setFechaInicioPreparto(
          nuevaFechaInicioPreparto.toISOString().split("T")[0]
        );
        const nuevaFechaFinPreparto = addDays(fechaNacimientoDate, -1);
        setFechaFinPreparto(nuevaFechaFinPreparto.toISOString().split("T")[0]);
        setFechaInicioPosparto(fechaNacimientoDate.toISOString().split("T")[0]);
        const nuevaFechaFinPosparto = addDays(
          fechaNacimientoDate,
          126 + factor
        );
        setFechaFinPosparto(nuevaFechaFinPosparto.toISOString().split("T")[0]);
        setFechaInicio("");
        setFechaFinalizacion("");
        setDiasAusencia(126);
        const factorpordias = salario / 30;
        const valor = factorpordias * 126;
        const valorFactorPrestacional = valor * factorPrestacional;
        const valorFormateado = valorFactorPrestacional.toLocaleString(
          "es-CO",
          {
            style: "currency",
            currency: "COP",
          }
        );
        if (valorFormateado) {
          setValorAusentismo(valorFormateado);
        }
        return;
      }
      if (prematuro) {
        const diasLicencia = 140 + 7 * (39 - semanasGestacion);
        const fechaNacimientoDate = new Date(e.target.value);
        setFechaInicio(fechaNacimientoDate.toISOString().split("T")[0]);
        setIsFechaInicioDisabled(true);
        const nuevaFechaFinalizacion = addDays(
          fechaNacimientoDate,
          diasLicencia
        );
        setFechaFinalizacion(
          nuevaFechaFinalizacion.toISOString().split("T")[0]
        );
        setIsFechaFinalizacionDisabled(true);
        setDiasAusencia(diasLicencia);
        const factor = salario / 30;
        const valor = factor * diasLicencia;
        const valorFactorPrestacional = valor * factorPrestacional;
        const valorFormateado = valorFactorPrestacional.toLocaleString(
          "es-CO",
          {
            style: "currency",
            currency: "COP",
          }
        );
        if (valorFormateado) {
          setValorAusentismo(valorFormateado);
        }
        return;
      }
      setIsFechaInicioDisabled(false);
      setIsFechaFinalizacionDisabled(false);
      return;
    }
    if (e.target.name === "factorPrestacional") {
      const value = parseFloat(e.target.value);
      if (isNaN(value) || value < 1.0) {
        alert("El factor prestacional no puede ser menor a 1.0");
        setFactorPrestacional(1.0);
        return;
      } else {
        setFactorPrestacional(value);
        const factor = salario / 30;
        const valor = factor * diasAusencia;
        const valorFactorPrestacional = valor * value;
        const valorFormateado = valorFactorPrestacional.toLocaleString(
          "es-CO",
          {
            style: "currency",
            currency: "COP",
          }
        );
        if (valorFormateado) {
          setValorAusentismo(valorFormateado);
        }
        return;
      }
    }
    if (e.target.name === "prematuro") {
      setPrematuro(e.target.checked);
      if (e.target.checked) {
        setShowModal(true);
        return;
      }
      setFechaInicioPreparto("");
      setFechaFinPreparto("");
      setFechaInicioPosparto("");
      setFechaFinPosparto("");
      setFechaInicio("");
      setFechaFinalizacion("");
      setDiasAusencia(0);
      setValorAusentismo("");
    }
    if (e.target.name === "semanasGestacion") {
      const value = parseInt(e.target.value);
      if (isNaN(value) || value < 24 || value > 37) {
        alert(
          "Las semanas de gestación deben ser mayor o igual a 24 y menor o igual a 37."
        );
        setSemanasGestacion(24);
        return;
      }
      setSemanasGestacion(value);
      return;
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "contingencia") {
      setContingencia(e.target.value);
      if (!["Licencia de Maternidad"].includes(e.target.value)) {
        setIsFechaInicioDisabled(false);
        setIsFechaFinalizacionDisabled(false);
        setLicenciaFraccionada(0);
        return;
      }
    }
    if (e.target.name === "licenciaFraccionada") {
      setLicenciaFraccionada(Number(e.target.value));
      setFechaNacimiento("");
      setFechaInicioPreparto("");
      setFechaFinPreparto("");
      setFechaInicioPosparto("");
      setFechaFinPosparto("");
      setDiasAusencia(0);
      setValorAusentismo("");
      setFactorPrestacional(1.0);
      setFechaInicio("");
      setFechaFinalizacion("");
      return;
    }
  };

  const closeModal = () => {
    setShowModal(false);
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
            "Licencia de Maternidad",
            "Licencia de Maternidad Parto Múltiple",
          ].includes(contingencia) && (
            <div className="md:col-span-2">
              <label className="block text-red-700">
                Las licencias de maternidad se registra conforme a lo definido
                en la Ley 2114 del 29 de Julio del 2021.
              </label>
            </div>
          )}
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
          {[
            "Licencia de Maternidad",
            "Licencia de Maternidad Parto Múltiple",
          ].includes(contingencia) && (
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
                <option value="0">No</option>
                <option value="1">1 Semana preparto</option>
                <option value="2">2 Semanas preparto</option>
              </select>
            </div>
          )}
          {["Licencia de Maternidad Parto Múltiple"].includes(contingencia) && (
            <div>
              <label className="block text-gray-700">
                ¿Él bebe es prematuro?
              </label>
              <input
                id="prematuro"
                name="prematuro"
                type="checkbox"
                className="mt-1 transform scale-150"
                onChange={handleInputChange}
              />
            </div>
          )}
          <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
            contentLabel="Aviso"
            className="modal"
            overlayClassName="overlay"
            ariaHideApp={false}
          >
            <h2 className="text-3xl font-bold text-red-600">Aviso</h2>
            <p className="text-black my-4">
              Conforme a la Ley 2114 de 2021 la licencia de maternidad parto
              múltiple con niños prematuros tiene una duración de 20 semanas
              (140 días) más las semanas faltantes a la semana 39, por lo cual
              el sistema lo calcula automáticamente a partir de la fecha de
              Nacimiento.
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Cerrar
            </button>
          </Modal>
          {prematuro && (
            <div>
              <label className="block text-gray-700">
                Semanas de Gestación
              </label>
              <input
                id="semanasGestacion"
                name="semanasGestacion"
                type="number"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                min={24}
                max={37}
                onChange={handleInputChange}
                value={semanasGestacion}
              />
              <label className="block text-red-700">
                Las semanas de gestación deben ser mayor o igual a 24 y menor o
                igual a 37.
              </label>
            </div>
          )}
          {licenciaFraccionada > 0 ||
            (prematuro && (
              <div>
                <label className="block text-gray-700">
                  Fecha de Nacimiento
                </label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                  required
                  value={fechaNacimiento}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          {licenciaFraccionada > 0 && (
            <div>
              <label className="block text-gray-700">
                Fecha Inicio Preparto
              </label>
              <input
                id="fechaInicioPreparto"
                name="fechaInicioPreparto"
                type="date"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                required
                value={fechaInicioPreparto}
                readOnly
              />
            </div>
          )}
          {licenciaFraccionada > 0 && (
            <div>
              <label className="block text-gray-700">Fecha Fin Preparto</label>
              <input
                id="fechaFinPreparto"
                name="fechaFinPreparto"
                type="date"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                required
                value={fechaFinPreparto}
                readOnly
              />
            </div>
          )}
          {licenciaFraccionada > 0 && (
            <div>
              <label className="block text-gray-700">
                Fecha Inicio Posparto
              </label>
              <input
                id="fechaInicioPosparto"
                name="fechaInicioPosparto"
                type="date"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                required
                value={fechaInicioPosparto}
                readOnly
              />
            </div>
          )}
          {licenciaFraccionada > 0 && (
            <div>
              <label className="block text-gray-700">Fecha Fin Posparto</label>
              <input
                id="fechaFinPosparto"
                name="fechaFinPosparto"
                type="date"
                className="mt-1 block w-full border-2 border-black rounded-md shadow-sm p-2 text-lg text-black"
                required
                value={fechaFinPosparto}
                readOnly
              />
            </div>
          )}
          {licenciaFraccionada === 0 && (
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
                disabled={isFechaInicioDisabled}
              />
            </div>
          )}
          {licenciaFraccionada === 0 && (
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
                disabled={isFechaFinalizacionDisabled}
              />
            </div>
          )}
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
