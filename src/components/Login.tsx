import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail, Lock } from "lucide-react";

interface LoginProps {
  onNavigateToSignup: () => void;
}

export function Login({ onNavigateToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f1f3d] p-8 rounded-xl w-full max-w-sm text-white"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Tesla Solar</h1>

        {error && (
          <p className="mb-4 text-red-400 text-sm text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="text-sm">Email</label>
          <div className="flex items-center bg-[#09162e] rounded mt-1">
            <Mail className="ml-2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              className="bg-transparent p-2 w-full outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm">Senha</label>
          <div className="flex items-center bg-[#09162e] rounded mt-1">
            <Lock className="ml-2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              className="bg-transparent p-2 w-full outline-none text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded font-semibold"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm">
          Não tem conta?{" "}
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="text-blue-400 hover:underline"
          >
            Criar conta
          </button>
        </p>
      </form>
    </div>
  );
}
