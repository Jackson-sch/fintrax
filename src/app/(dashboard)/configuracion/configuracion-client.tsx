"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  DollarSign, 
  Save, 
  Loader2, 
  Shield, 
  KeyRound, 
  Eye, 
  EyeOff,
  CheckCircle2
} from "lucide-react";

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
import { authClient } from "@/lib/auth-client";
import { updateCurrency, updateProfile } from "@/actions/financial-actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfiguracionClientProps {
  user: {
    name: string;
    email: string;
    currency: string;
  };
}

export function ConfiguracionClient({ user }: ConfiguracionClientProps) {
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requirements = checkRequirements(newPassword);
  const strength = newPassword ? getStrength(requirements) : 0;

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    try {
      setIsLoadingProfile(true);
      await updateProfile(name);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleCurrencyChange = async (newCurrency: string | null) => {
    if (!newCurrency) return;
    try {
      setIsLoadingCurrency(true);
      setCurrency(newCurrency);
      await updateCurrency(newCurrency);
      toast.success("Moneda actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar la moneda");
      setCurrency(user.currency);
    } finally {
      setIsLoadingCurrency(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos de contraseña");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      setIsLoadingPassword(true);
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Error al cambiar la contraseña");
        return;
      }

      toast.success("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      toast.error("Error inesperado al cambiar la contraseña");
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Tu Espacio</h1>
        <p className="text-slate-400 max-w-lg text-sm md:text-base">
          Personaliza tu experiencia y protege tu cuenta con un entorno seguro y adaptable.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
        
        {/* =======================
            TARJETA 1: PERFIL (Col Span 2)
        ======================= */}
        <div className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl lg:col-span-2 flex flex-col justify-between transition-colors hover:bg-white/10">
          {/* Soft Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none transition-all group-hover:bg-blue-500/30" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Perfil de Usuario</h2>
                <p className="text-sm text-slate-400">Administra tu información personal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-black/20 border border-white/5 text-slate-400 rounded-2xl py-3.5 pl-11 pr-4 opacity-70 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500">Contacta a soporte para cambiarlo.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isLoadingProfile || name === user.name}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600/90 hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] text-sm font-medium"
            >
              {isLoadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isLoadingProfile ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>

        {/* =======================
            TARJETA 2: PREFERENCIAS (Col Span 1)
        ======================= */}
        <div className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl lg:col-span-1 flex flex-col transition-colors hover:bg-white/10">
          {/* Soft Glow */}
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none transition-all group-hover:bg-emerald-500/30" />
          
          <div className="relative z-10 space-y-6 grow">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Preferencias</h2>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Define tu divisa predeterminada. Todas las transacciones y balances se adaptarán.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Moneda Principal</label>
              <Select
                value={currency}
                onValueChange={handleCurrencyChange}
                disabled={isLoadingCurrency}
              >
                <SelectTrigger className="w-full bg-black/20 border border-white/10 text-white rounded-2xl py-6 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all">
                  <SelectValue placeholder="Selecciona tu moneda" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl backdrop-blur-xl">
                  <SelectItem value="USD" className="py-2.5 focus:bg-white/10">🇺🇸 Dólar (USD)</SelectItem>
                  <SelectItem value="EUR" className="py-2.5 focus:bg-white/10">🇪🇺 Euro (EUR)</SelectItem>
                  <SelectItem value="MXN" className="py-2.5 focus:bg-white/10">🇲🇽 Peso (MXN)</SelectItem>
                  <SelectItem value="ARS" className="py-2.5 focus:bg-white/10">🇦🇷 Peso (ARS)</SelectItem>
                  <SelectItem value="COP" className="py-2.5 focus:bg-white/10">🇨🇴 Peso (COP)</SelectItem>
                  <SelectItem value="CLP" className="py-2.5 focus:bg-white/10">🇨🇱 Peso (CLP)</SelectItem>
                  <SelectItem value="PEN" className="py-2.5 focus:bg-white/10">🇵🇪 Sol (PEN)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoadingCurrency && (
            <div className="relative z-10 mt-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            </div>
          )}
        </div>

        {/* =======================
            TARJETA 3: SEGURIDAD (Col Span 2)
        ======================= */}
        <div className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl lg:col-span-2 transition-colors hover:bg-white/10">
          {/* Soft Glow */}
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none transition-all group-hover:bg-rose-500/30" />

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Seguridad de la Cuenta</h2>
                <p className="text-sm text-slate-400">Actualiza tu contraseña periódicamente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contraseña Actual */}
              <div className="md:col-span-2 space-y-2 max-w-md">
                <label className="text-sm font-medium text-slate-300">Contraseña Actual</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-12 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nueva Contraseña</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-12 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Strength bar and requirements checklist */}
                {newPassword.length > 0 && (
                  <div className="space-y-3 pt-1 animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-px flex-1 rounded-full transition-all duration-300 ${
                              i <= strength ? STRENGTH_COLOR[strength] : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${STRENGTH_TEXT[strength]}`}>
                        Calidad: {STRENGTH_LABEL[strength]}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirmar Contraseña</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-12 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSavePassword}
                disabled={isLoadingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-6 py-3 bg-rose-600/90 hover:bg-rose-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.4)] text-sm font-medium"
              >
                {isLoadingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isLoadingPassword ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
          </div>
        </div>

        {/* =======================
            TARJETA 4: STATUS (Col Span 1)
        ======================= */}
        <div className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl lg:col-span-1 flex flex-col items-center justify-center text-center transition-colors hover:bg-white/10 min-h-[250px]">
          <div className="absolute inset-0 bg-linear-to-t from-indigo-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full bg-indigo-500/10 border border-indigo-400/30 rounded-2xl">
                <Shield className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white">Cuenta Protegida</h3>
              <p className="text-sm text-indigo-200/60 mt-2 leading-relaxed">
                Tus datos están asegurados con estándares modernos de encriptación.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}