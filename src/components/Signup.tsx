import { useState } from "react";
import { supabase } from "../lib/supabase";

interface SignupProps {
  onNavigateToLogin: () => void;
}

export function Signup({ onNavigateToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setInfo("Usuário criado! Se o projeto exigir confirmação, verifique seu e-mail.");
    // Se o Supabase fizer login automático, o App vai para dashboard.
    // Senão, o usuário confirma e depois loga.
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {info && <p style={{ color: "lime" }}>{info}</p>}
      <form onSubmit={handleSubmit}>
        {/* seus inputs */}
      </form>
      <button onClick={onNavigateToLogin}>Voltar para login</button>
    </div>
  );
}
