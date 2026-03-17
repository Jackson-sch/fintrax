import { Header } from "@/components/sidebar/header";
import { StepCard } from "@/components/ayuda/step-card";
import {
  Smartphone,
  Monitor,
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Ayuda | FinanceFlow",
  description:
    "Guía de instalación y uso de FinanceFlow como aplicación móvil.",
};

export default function AyudaPage() {
  return (
    <>
      <Header
        title="Centro de Ayuda"
        subtitle="Aprende a instalar y usar FinanceFlow en todos tus dispositivos"
      />

      <div className="p-6 md:p-8 space-y-10 max-w-4xl mx-auto">
        {/* Intro */}
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Download className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Instala FinanceFlow en tu dispositivo
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            FinanceFlow es una Progressive Web App (PWA). Puedes instalarla
            directamente desde tu navegador y usarla como una app nativa, sin
            necesidad de tiendas de aplicaciones.
          </p>
        </div>

        {/* iOS Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/20 text-white rounded-xl border border-slate-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">iPhone / iPad</h3>
              <p className="text-xs text-slate-500">
                Safari • iOS 14 o superior
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <StepCard
              step={1}
              icon={ArrowRight}
              title="Abre Safari"
              description="Abre Safari y navega a la dirección de Fintrax. Es importante que uses Safari, ya que otros navegadores en iOS no soportan la instalación de PWAs."
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={2}
              icon={Share}
              title='Toca el botón "Compartir"'
              description="Busca el ícono de compartir (un cuadrado con una flecha hacia arriba ↑) en la barra inferior del navegador y tócalo."
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={3}
              icon={PlusSquare}
              title='"Agregar a Pantalla de Inicio"'
              description='Desplázate por las opciones y selecciona "Agregar a Pantalla de Inicio". Puedes personalizar el nombre si lo deseas.'
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={4}
              icon={CheckCircle2}
              title='Toca "Agregar"'
              description="¡Listo! Fintrax aparecerá en tu pantalla de inicio como cualquier otra app. Se abrirá en pantalla completa sin la barra del navegador."
            />
          </div>
        </section>

        {/* Android Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Android</h3>
              <p className="text-xs text-slate-500">
                Chrome • Android 8 o superior
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <StepCard
              step={1}
              icon={ArrowRight}
              title="Abre Chrome"
              description="Navega a la dirección de FinanceFlow usando Google Chrome en tu dispositivo Android."
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={2}
              icon={MoreVertical}
              title="Toca el menú (⋮)"
              description="Toca los tres puntos verticales en la esquina superior derecha de Chrome para abrir el menú del navegador."
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={3}
              icon={Download}
              title='"Instalar aplicación"'
              description='Busca y selecciona la opción "Instalar aplicación" o "Agregar a pantalla de inicio" en el menú desplegable.'
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={4}
              icon={CheckCircle2}
              title="Confirma la instalación"
              description="Toca 'Instalar' en el diálogo que aparece. La app se instalará y aparecerá en tu bandeja de aplicaciones como una app nativa."
            />
          </div>
        </section>

        {/* Desktop Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Escritorio (PC / Mac)
              </h3>
              <p className="text-xs text-slate-500">
                Chrome, Edge • Windows, macOS, Linux
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <StepCard
              step={1}
              icon={ArrowRight}
              title="Abre Chrome o Edge"
              description="Navega a la dirección de FinanceFlow en tu navegador de escritorio."
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={2}
              icon={Download}
              title="Haz clic en instalar"
              description='Busca el ícono de instalación (⊕) en la barra de direcciones del navegador, o ve al menú y selecciona "Instalar FinanceFlow".'
            />
            <div className="border-t border-white/5" />
            <StepCard
              step={3}
              icon={CheckCircle2}
              title="Confirma"
              description="Haz clic en 'Instalar' y listo. La app se abrirá en su propia ventana y podrás encontrarla en tu menú de inicio o dock."
            />
          </div>
        </section>

        {/* Benefits */}
        <div className="bg-linear-to-br from-blue-600/20 to-indigo-600/10 p-8 rounded-[40px] border border-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-4">
              ¿Por qué instalar la app?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Acceso rápido desde la pantalla de inicio",
                "Funciona sin barra del navegador",
                "Carga más rápido que desde el navegador",
                "Siempre actualizada automáticamente",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                  <p className="text-sm text-blue-100/80">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </>
  );
}
