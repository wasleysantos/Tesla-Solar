import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import logoImage from "figma:asset/86a5dbd476eaf5850e2d574675b5ba3853e32186.png";
import ifmaImage from "figma:asset/ifma.png";

interface LoginProps {
  onNavigateToSignup: () => void;
}

export function Login({ onNavigateToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    // Se deu certo, o App.tsx muda para dashboard via onAuthStateChange
  };

  return (
    <div>
      {/* seu layout */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* inputs do email/senha */}
      </form>
      <button onClick={onNavigateToSignup}>Criar conta</button>
    </div>
  );
}
