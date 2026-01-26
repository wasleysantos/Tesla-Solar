import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logoImage from "figma:asset/86a5dbd476eaf5850e2d574675b5ba3853e32186.png";
import ifmaImage from "figma:asset/ifma.png";

interface LoginProps {
  // Agora aceita retornar uma mensagem de erro (string) ou null.
  // Se o seu onLogin atual retorna void, ainda vai funcionar.
  onLogin: (email: string, password: string) => Promise<string | null> | string | null | void;
  onNavigateToSignup: () => void;
}

export function Login({ onLogin, onNavigateToSignup }: LoginProps) {
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

      // Se o App.tsx retornar uma string, mostramos o erro
      if (typeof result === "string" && result.trim().length > 0) {
        setErrorMessage(result);
      }
    } catch {
      // Fallback caso algum erro estoure
      setErrorMessage("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-12">
          <img
            src={logoImage}
            alt="Logo"
            className="h-16 mb-3 object-contain"
          />
          <div className="text-center">
            <p className="text-green-400 font-bold text-lg tracking-[0.2em] uppercase bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Multimedidor Fotovoltaico
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a2942] rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo</h2>
          <p className="text-gray-400 mb-8">Entre para acessar seu sistema</p>

          {/* Mensagem de erro (não muda o layout, só aparece quando existir) */}
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a1628] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
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
                  onChange={(e) => setPassword(e.target.value)}
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
                className="text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta?{" "}
              <button
                onClick={onNavigateToSignup}
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                disabled={loading}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
