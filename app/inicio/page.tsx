import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-black">Página de Inicio</h1>
      <div className="space-y-4">
        <Link href="/registrarAusentismo">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Registrar Ausentismo
          </div>
        </Link>
        <Link href="/consultar">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Consultar
          </div>
        </Link>
        <Link href="/reportes">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Reportes
          </div>
        </Link>
        <Link href="/graficas-reportes">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Gráficas Reportes
          </div>
        </Link>
      </div>
    </div>
  );
}