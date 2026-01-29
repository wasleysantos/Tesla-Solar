import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logoImage from "figma:asset/86a5dbd476eaf5850e2d574675b5ba3853e32186.png";
import { ShieldCheck } from "lucide-react";


interface LoginProps {
  onLogin: (
    email: string,
    password: string
  ) => Promise<string | null> | string | null | void;

  onGoogleLogin: () => Promise<string | null> | string | null | void;

  onNavigateToSignup: () => void;
}

export function Login({ onLogin, onGoogleLogin, onNavigateToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) return;

    try {
      setLoading(true);
      const result = await onLogin(email, password);

      if (typeof result === "string" && result.trim().length > 0) {
        setErrorMessage(result);
      }
    } catch {
      setErrorMessage("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");

    try {
      setLoading(true);
      const result = await onGoogleLogin();

      if (typeof result === "string" && result.trim().length > 0) {
        setErrorMessage(result);
      }
    } catch {
      setErrorMessage("Não foi possível entrar com Google agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a1628]">
      <div className="w-full max-w-md">
        {/* Logo e Badge de ADM */}
        <div className="flex flex-col items-center justify-center mb-8">
          <img src={logoImage} alt="Logo" className="h-16 mb-4 object-contain" />
          <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              Acesso Administrativo
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a2942] rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Painel de Gestão</h2>
          <p className="text-gray-400 mb-8">Entre para monitorar os dispositivos solares.</p>

          {/* Mensagem de erro */}
          {errorMessage && (
            <div className="mb-6 rounded-lg border-2 border-red-900 bg-red-600 px-4 py-3 shadow-lg shadow-red-900/40">
              <p className="text-sm font-bold text-black text-center">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full bg-[#0a1628] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="admin@teslalab.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full bg-[#0a1628] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-green-400 hover:text-green-300 transition-colors disabled:opacity-70"
                disabled={loading}
                // força cursor (garantido)
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-semibold py-3 rounded-lg transition-colors"
              // força cursor (garantido)
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* ✅ Google abaixo do campo senha (abaixo do botão Entrar) */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-700 flex-1" />
              <span className="text-gray-500 text-sm">AUTENTIÇÃO SSO</span>
              <div className="h-px bg-gray-700 flex-1" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                backgroundColor: "#ffffff",
                color: "#111827",
                cursor: loading ? "not-allowed" : "pointer", // força cursor
              }}
              className="w-full border border-gray-100 hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-lg transition flex items-center justify-center gap-3 shadow-sm disabled:opacity-70"
            >
              {/* IMPORTANT: isso impede o SVG de “roubar” o hover/cursor */}
              <svg
                className="pointer-events-none"
                width="18"
                height="18"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.2-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.1 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.3 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.4 39.6 16.1 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.0 2.9-3.1 5.2-5.9 6.6l6.2 5.2C39.2 36.4 44 31.0 44 24c0-1.1-.1-2.2-.4-3.5z"
                />
              </svg>

              {loading ? "Carregando..." : "Entrar com Google"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta? Solicitar acesso à TI{" "}
             
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
