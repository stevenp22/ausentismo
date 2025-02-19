"use client";
import { useState } from "react";
import { buscarTrabajador } from "../lib/actions";
import { Trabajador } from "../lib/definitions";
import Link from "next/link";

export default function Page() {
  const [documento, setDocumento] = useState("");
  const [trabajador, setTrabajador] = useState<Trabajador | null>();

  const handleSearch = async () => {
    const result = await buscarTrabajador(documento);
    if (result) {
      setTrabajador(result);
    } else {
      setTrabajador(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto p-4 bg-white text-black">
        <div className="mt-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Trabajador</h1>
          <Link
            href="/trabajadores/registrar"
            className="bg-green-500 text-white p-2 rounded block text-center mb-4"
          >
            Registrar Trabajador
          </Link>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4">Buscar Trabajador</h1>
          <input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder="Número de Documento"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Buscar
          </button>
        </div>
        {trabajador === null && (
          <div className="bg-red-100 p-4 rounded shadow-md">
            <p className="text-red-500">No se encontró el trabajador</p>
          </div>
        )}
        {trabajador && (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">
              Información del Trabajador
            </h2>
            <p>
              <strong>Documento:</strong> {trabajador.documento}
            </p>
            <p>
              <strong>Nombre:</strong> {trabajador.nombre}
            </p>
            <p>
              <strong>Género:</strong> {trabajador.genero}
            </p>
            <p>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {new Date(trabajador.fechaNacimiento).toLocaleDateString()}
            </p>
            <p>
              <strong>Cargo:</strong> {trabajador.cargo}
            </p>
            <p>
              <strong>EPS:</strong> {trabajador.eps}
            </p>
            <p>
              <strong>Salario:</strong> {trabajador.salario}
            </p>
            <p>
              <strong>Ocupación:</strong> {trabajador.ocupacion}
            </p>
            <p>
              <strong>Tipo de Vinculación:</strong> {trabajador.tipoVinculacion}
            </p>
            <p>
              <strong>AFP:</strong> {trabajador.afp}
            </p>
            <p>
              <strong>Jornada:</strong> {trabajador.jornada}
            </p>
            <p>
              <strong>Contratación:</strong> {trabajador.contratacion}
            </p>
            <div className="mt-4 flex space-x-2">
              <Link
                href={`/trabajadores/${trabajador.id}/editar`}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Editar Trabajador
              </Link>
              <Link
                href={`/trabajadores/${trabajador.id}/registrarAusencia`}
                className="bg-green-500 text-white p-2 rounded"
              >
                Registrar Ausencia
              </Link>
              <Link
                href={`/trabajadores/${trabajador.id}/ausencias`}
                className="bg-red-500 text-white p-2 rounded"
              >
                Consultar Ausencias
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
