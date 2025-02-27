"use client";
import { useEffect, useState } from "react";
import { buscarAusentismo } from "../../../lib/actions";
import { Ausentismo } from "../../../lib/definitions";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const [ausentismos, setAusentismos] = useState<Ausentismo[]>([]);

  useEffect(() => {
      const fetchParams = async () => {
        const params = await props.params;
        const ausentismos = await buscarAusentismo(Number(params.id));
        setAusentismos(ausentismos);
      };
      fetchParams();
    }, [props.params]);

  return (
    <div className="bg-white text-black p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Registro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contingencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Inicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Finalizacion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dias Ausencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Ausentismo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ausentismos.map((ausentismo) => (
            <tr key={ausentismo.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {ausentismo.fechaRegistro.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ausentismo.contingencia}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ausentismo.fechaInicio.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ausentismo.fechaFinalizacion.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ausentismo.diasAusencia}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ausentismo.valorAusentismo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* Add action buttons here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
