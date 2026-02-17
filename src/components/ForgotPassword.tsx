import { useEffect, useState, type FormEvent } from "react";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import logoImage from "figma:asset/86a5dbd476eaf5850e2d574675b5ba3853e32186.png";
import solarBg from "../assets/solar.png";
import { supabase } from "../lib/supabase";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // animação suave
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const topAnim = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 -translate-y-2";

  const cardAnim = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setOkMessage("");

    const clean = email.trim().toLowerCase();
    if (!clean) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setOkMessage("Enviamos um link de redefinição para seu e-mail.");
      setEmail("");
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();

      if (msg.includes("rate limit") || msg.includes("too many requests")) {
        setErrorMessage(
          "Muitas tentativas. Aguarde um pouco e tente novamente.",
        );
      } else {
        setErrorMessage(
          err?.message ?? "Não foi possível enviar o e-mail. Tente novamente.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* ✅ BACKGROUND FIXO 100% */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${solarBg})` }}
      />

      {/* Gradiente */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0a1628]/90 via-[#0a1628]/80 to-[#071224]/95 pointer-events-none" />

      {/* Vinheta */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* Luz solar animada */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[140px] animate-solarGlow" />
      </div>

      {/* Conteúdo */}
      <div className="min-h-dvh w-full flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md relative z-10">
          {/* Top */}
          <div
            className={[
              "flex flex-col items-center justify-center mb-6 sm:mb-8",
              "transition-all duration-700 ease-out",
              topAnim,
            ].join(" ")}
          >
            <img
              src={logoImage}
              alt="Logo"
              className="h-9 sm:h-16 mb-2 sm:mb-4 object-contain"
            />
            <div className="flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-[9px] font-semibold uppercase tracking-wide">
                Recuperação de Acesso
              </span>
            </div>
          </div>

          {/* Card */}
          <div
            className={[
              "bg-[#1a2942] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10",
              "transition-all duration-700 ease-out delay-75",
              cardAnim,
            ].join(" ")}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Esqueceu a senha?
              </h2>

              <button
                type="button"
                onClick={onBackToLogin}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-70"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>
            </div>

            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Informe seu e-mail para enviarmos um link de redefinição.
            </p>

            {errorMessage && (
              <div className="mb-5 rounded-lg border-2 border-red-900 bg-red-600 px-4 py-3 shadow-lg shadow-red-900/40">
                <p className="text-sm font-bold text-black text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {okMessage && (
              <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <p className="text-sm font-semibold text-green-200 text-center">
                  {okMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage("");
                      setOkMessage("");
                    }}
                    className="w-full bg-[#0a1628] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="admin@teslalab.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-70 transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
