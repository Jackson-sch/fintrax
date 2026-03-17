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
  title: "Ayuda | Fintrax",
  description: "Guía de instalación y uso de Fintrax como aplicación móvil.",
};

/* ── shared card base ── */
const card = "relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 backdrop-blur-2xl";

/* ── platform data ── */
const PLATFORMS = [
  {
    id: "ios",
    label: "iPhone / iPad",
    sub: "Safari · iOS 14 o superior",
    color: "slate",
    iconColor: "text-slate-300",
    iconBg: "bg-slate-500/10 border-slate-400/20",
    glowColor: "bg-slate-400/6",
    accentVia: "via-slate-400/30",
    steps: [
      { icon: ArrowRight, title: "Abre Safari", description: "Navega a la dirección de Fintrax. Es importante usar Safari — otros navegadores en iOS no soportan instalación de PWAs." },
      { icon: Share, title: 'Toca "Compartir"', description: "Busca el ícono de compartir (cuadrado con flecha ↑) en la barra inferior de Safari y tócalo." },
      { icon: PlusSquare, title: '"Agregar a Pantalla de Inicio"', description: 'Desplázate por las opciones y selecciona "Agregar a Pantalla de Inicio". Puedes personalizar el nombre.' },
      { icon: CheckCircle2, title: 'Toca "Agregar"', description: "¡Listo! Fintrax aparecerá en tu pantalla de inicio y se abrirá en pantalla completa sin la barra del navegador." },
    ],
  },
  {
    id: "android",
    label: "Android",
    sub: "Chrome · Android 8 o superior",
    color: "emerald",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-400/20",
    glowColor: "bg-emerald-500/6",
    accentVia: "via-emerald-400/30",
    steps: [
      { icon: ArrowRight, title: "Abre Chrome", description: "Navega a la dirección de Fintrax usando Google Chrome en tu dispositivo Android." },
      { icon: MoreVertical, title: "Toca el menú (⋮)", description: "Toca los tres puntos verticales en la esquina superior derecha de Chrome para abrir el menú del navegador." },
      { icon: Download, title: '"Instalar aplicación"', description: 'Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio" en el menú desplegable.' },
      { icon: CheckCircle2, title: "Confirma la instalación", description: "Toca 'Instalar' en el diálogo que aparece. La app se instalará en tu bandeja como una app nativa." },
    ],
  },
  {
    id: "desktop",
    label: "Escritorio",
    sub: "Chrome, Edge · Windows, macOS, Linux",
    color: "indigo",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-400/20",
    glowColor: "bg-indigo-500/6",
    accentVia: "via-indigo-400/30",
    steps: [
      { icon: ArrowRight, title: "Abre Chrome o Edge", description: "Navega a la dirección de Fintrax en tu navegador de escritorio." },
      { icon: Download, title: "Haz clic en instalar", description: 'Busca el ícono ⊕ en la barra de direcciones, o ve al menú y selecciona "Instalar Fintrax".' },
      { icon: CheckCircle2, title: "Confirma", description: "Haz clic en 'Instalar'. La app se abrirá en su propia ventana y podrás encontrarla en tu menú de inicio o dock." },
    ],
  },
];

const BENEFITS = [
  "Acceso rápido desde la pantalla de inicio",
  "Funciona sin barra del navegador",
  "Carga más rápido que desde el navegador",
  "Siempre actualizada automáticamente",
];

export default function AyudaPage() {
  return (
    <>
      <Header
        title="Centro de Ayuda"
        subtitle="Aprende a instalar y usar Fintrax en todos tus dispositivos"
      />

      <div className="px-6 py-10 md:px-10 md:py-12 space-y-8 max-w-4xl mx-auto">

        {/* ── Hero intro card ── */}
        <div className={`${card} p-8 flex flex-col sm:flex-row items-center gap-6 bg-linear-to-br from-blue-500/8 to-transparent`}>
          {/* Accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-400/40 to-transparent" />
          {/* Glow */}
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-24 bg-blue-500/10 rounded-full blur-2xl" />

          <div className="relative shrink-0 w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shadow-inner">
            <Download className="h-7 w-7 text-blue-400" />
          </div>

          <div className="relative text-center sm:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Instala Fintrax en tu dispositivo
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xl">
              Fintrax es una <span className="text-slate-400 font-medium">Progressive Web App (PWA)</span>. Puedes instalarla directamente desde tu navegador y usarla como app nativa, sin tiendas de aplicaciones.
            </p>
          </div>
        </div>

        {/* ── Platform sections ── */}
        {PLATFORMS.map((platform) => (
          <section key={platform.id} className="space-y-3">

            {/* Section header */}
            <div className="flex items-center gap-3 px-1">
              <div className={`p-2.5 rounded-xl border ${platform.iconBg}`}>
                {platform.id === "desktop"
                  ? <Monitor className={`h-[18px] w-[18px] ${platform.iconColor}`} />
                  : <Smartphone className={`h-[18px] w-[18px] ${platform.iconColor}`} />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white leading-tight">{platform.label}</h3>
                <p className="text-xs text-slate-600">{platform.sub}</p>
              </div>
            </div>

            {/* Steps card */}
            <div className={`${card} bg-linear-to-br from-${platform.color}-500/5 to-transparent`}>
              {/* Top accent */}
              <div className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent ${platform.accentVia} to-transparent`} />
              {/* Corner glow */}
              <div className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 ${platform.glowColor} rounded-full blur-2xl`} />

              <div className="relative p-6 divide-y divide-white/5">
                {platform.steps.map((step, i) => (
                  <div key={i} className={i === 0 ? "" : "pt-5"}>
                    {i !== 0 && <div className="mb-5" />}
                    <div className="flex gap-4">
                      {/* Step number */}
                      <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border ${platform.iconBg} ${platform.iconColor}`}>
                        {i + 1}
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">{step.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    {i < platform.steps.length - 1 && (
                      <div className="mt-5 border-t border-white/5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Benefits card ── */}
        <div className={`${card} p-7 bg-linear-to-br from-blue-600/10 via-indigo-500/5 to-transparent`}>
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-400/40 to-transparent" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-500/8 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/20">
                <CheckCircle2 className="h-[18px] w-[18px] text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">¿Por qué instalar la app?</h3>
                <p className="text-xs text-slate-500">Ventajas frente a usar el navegador</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/3 border border-white/6"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-sm text-slate-400">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}