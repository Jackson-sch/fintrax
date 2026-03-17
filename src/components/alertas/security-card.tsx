import { ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export function SecurityCard() {
  return (
    <div className="bg-linear-to-br from-blue-600/20 to-indigo-600/10 p-8 rounded-[32px] border border-blue-500/20 relative overflow-hidden group">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Tu Cuenta está Protegida
            </h3>
            <p className="text-blue-200/70 max-w-sm">
              Estamos utilizando encriptación de grado bancario y sesiones
              seguras para mantener tus datos financieros a salvo.
            </p>
          </div>
        </div>
        <Link 
          href="/configuracion"
          className="px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
        >
          Revisar Seguridad <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700" />
    </div>
  );
}
