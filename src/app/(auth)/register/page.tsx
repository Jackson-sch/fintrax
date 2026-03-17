"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, User, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

/* ── Password strength util ── */
interface PasswordRequirements {
  length: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
}

function checkRequirements(pw: string): PasswordRequirements {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

function getStrength(reqs: PasswordRequirements): 0 | 1 | 2 | 3 {
  const count = Object.values(reqs).filter(Boolean).length;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

const STRENGTH_LABEL = ["", "Débil", "Regular", "Fuerte"];
const STRENGTH_COLOR = ["", "bg-rose-500", "bg-amber-400", "bg-emerald-400"];
const STRENGTH_TEXT  = ["", "text-rose-400", "text-amber-400", "text-emerald-400"];

/* ── Perks list shown beside form ── */
const PERKS = [
  "Sin tarjeta de crédito requerida",
  "Acceso inmediato al dashboard",
  "Datos encriptados de extremo a extremo",
];

export default function RegisterPage() {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const requirements = checkRequirements(password);
  const strength = password ? getStrength(requirements) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "Error al registrarse");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsGoogleLoading(true);

    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      setError(error.message || "Error con Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-fade-in relative z-10">

        {/* ── Brand ── */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden border border-white/10">
              <Image
                src="/icon-fintrax.png"
                alt="Fintrax"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Fintrax</span>
          </div>
          <p className="text-sm text-slate-500">Crea tu cuenta, es gratis</p>
        </div>

        {/* ── Main Card ── */}
        <div className="relative rounded-3xl border border-white/8 bg-white/3 backdrop-blur-2xl shadow-2xl shadow-black/30 overflow-hidden">

          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-400/40 to-transparent" />
          {/* Inner glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-2xl" />

          <div className="relative p-8 space-y-5">

            {/* ── Error ── */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-rose-500/8 border border-rose-500/20 text-rose-400 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Nombre
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-2xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Correo
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-2xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Contraseña + strength */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/8 rounded-2xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors rounded-lg"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Strength bar and requirements checklist */}
                {password.length > 0 && (
                  <div className="space-y-3 pt-1 animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength ? STRENGTH_COLOR[strength] : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${STRENGTH_TEXT[strength]}`}>
                        Calidad: {STRENGTH_LABEL[strength]}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center gap-2">
                         <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${requirements.length ? "bg-emerald-500/20" : "bg-white/5"}`}>
                            <CheckCircle2 className={`w-2.5 h-2.5 transition-colors ${requirements.length ? "text-emerald-400" : "text-slate-600"}`} />
                         </div>
                         <span className={`text-[11px] transition-colors ${requirements.length ? "text-slate-300" : "text-slate-500"}`}>8+ caracteres</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${requirements.upper ? "bg-emerald-500/20" : "bg-white/5"}`}>
                            <CheckCircle2 className={`w-2.5 h-2.5 transition-colors ${requirements.upper ? "text-emerald-400" : "text-slate-600"}`} />
                         </div>
                         <span className={`text-[11px] transition-colors ${requirements.upper ? "text-slate-300" : "text-slate-500"}`}>Una mayúscula</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${requirements.number ? "bg-emerald-500/20" : "bg-white/5"}`}>
                            <CheckCircle2 className={`w-2.5 h-2.5 transition-colors ${requirements.number ? "text-emerald-400" : "text-slate-600"}`} />
                         </div>
                         <span className={`text-[11px] transition-colors ${requirements.number ? "text-slate-300" : "text-slate-500"}`}>Un número</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${requirements.symbol ? "bg-emerald-500/20" : "bg-white/5"}`}>
                            <CheckCircle2 className={`w-2.5 h-2.5 transition-colors ${requirements.symbol ? "text-emerald-400" : "text-slate-600"}`} />
                         </div>
                         <span className={`text-[11px] transition-colors ${requirements.symbol ? "text-slate-300" : "text-slate-500"}`}>Un símbolo</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600/90 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all duration-200 mt-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs font-medium text-slate-600 tracking-widest uppercase">o</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* ── Google ── */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/8 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/8 hover:border-white/15 text-slate-200 text-sm font-semibold transition-all duration-200"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Registrarse con Google
            </button>

            {/* ── Perks ── */}
            <div className="space-y-2 pt-1">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-500">{perk}</span>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <p className="text-center text-xs text-slate-600 pt-1">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* ── Bottom tagline ── */}
        <p className="text-center text-xs text-slate-700 mt-6">
          Protegido con encriptación de extremo a extremo
        </p>
      </div>
    </div>
  );
}