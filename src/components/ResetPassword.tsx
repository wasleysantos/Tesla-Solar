import { useState } from "react";
import { supabase } from "../lib/supabase";

export function ResetPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!password || password.length < 6) {
      setMsg("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setMsg("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMsg("Não foi possível atualizar a senha. Tente novamente.");
        return;
      }

      setMsg("Senha atualizada com sucesso! Você já pode entrar.");
      onDone();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1a2942] rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Nova senha</h2>
        <p className="text-gray-400 mb-6">Defina uma nova senha para sua conta</p>

        {msg && (
          <div className="mb-5 rounded-lg border border-gray-700 bg-[#0a1628] px-4 py-3">
            <p className="text-sm text-white text-center">{msg}</p>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nova senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 outline-none"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Confirmar senha</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-[#0a1628] text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 outline-none"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
