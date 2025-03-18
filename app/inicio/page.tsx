import Link from "next/link";
import { signOut } from "@/auth";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-black">Ausentismo</h1>
      <div className="space-y-4">
        <Link href="/registrarTrabajador" className="text-lg">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Registrar Trabajador
          </div>
        </Link>
        <Link href="/trabajadores" className="text-lg">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Buscar Trabajador y Registrar Ausentismo
          </div>
        </Link>
        <Link href="/masivo" className="text-lg">
          <div className="text-blue-500 hover:underline cursor-pointer">
            Carga masiva de trabajadores
          </div>
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-red-500 p-3 text-sm font-medium text-white hover:bg-red-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="hidden md:block">Cerrar Sesion</div>
          </button>
        </form>
      </div>
    </div>
  );
}
