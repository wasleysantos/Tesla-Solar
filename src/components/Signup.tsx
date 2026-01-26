import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail, Lock, User } from "lucide-react";

interface SignupProps {
  onNavigateToLogin: () => void;
}

export function Signup({ onNavigateToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setInfo(
      "Conta criada com sucesso! Verifique seu e-mail se a confirmação estiver ativada."
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f1f3d] p-8 rounded-xl w-full max-w-sm text-white"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Criar conta</h1>

        {error && (
          <p className="mb-4 text-red-400 text-sm text-center">{error}</p>
        )}

        {info && (
          <p className="mb-4 text-green-400 text-sm text-center">{info}</p>
        )}

        <div className="mb-4">
          <label className="text-sm">Nome</label>
          <div className="flex items-center bg-[#09162e] rounded mt-1">
            <User className="ml-2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="bg-transparent p-2 w-full outline-none text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

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

        <div className="mb-4">
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

        <div className="mb-6">
          <label className="text-sm">Confirmar senha</label>
          <div className="flex items-center bg-[#09162e] rounded mt-1">
            <Lock className="ml-2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              className="bg-transparent p-2 w-full outline-none text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition p-2 rounded font-semibold"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <p className="mt-4 text-center text-sm">
          Já tem conta?{" "}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-blue-400 hover:underline"
          >
            Voltar para login
          </button>
        </p>
      </form>
    </div>
  );
}
