import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { supabase } from "./lib/supabase";

type Screen = "login" | "signup" | "dashboard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega sessão do Supabase ao iniciar + escuta mudanças de login/logout
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao obter sessão:", error.message);
        setUser(null);
        setCurrentScreen("login");
        setLoading(false);
        return;
      }

      const u = data.session?.user;
      if (u) {
        setUser({
          name: (u.user_metadata?.name as string) || "Usuário",
          email: u.email || "",
        });
        setCurrentScreen("dashboard");
      } else {
        setUser(null);
        setCurrentScreen("login");
      }

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) {
        setUser({
          name: (u.user_metadata?.name as string) || "Usuário",
          email: u.email || "",
        });
        setCurrentScreen("dashboard");
      } else {
        setUser(null);
        setCurrentScreen("login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Login REAL (Supabase) - agora retorna mensagem de erro para o Login.tsx exibir
  const handleLogin = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) return null;

    // Mensagens amigáveis (sem expor texto técnico)
    const msg = (error.message || "").toLowerCase();

    if (msg.includes("invalid login credentials")) {
      return "E-mail ou senha incorretos.";
    }
    if (msg.includes("email not confirmed")) {
      return "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.";
    }
    if (msg.includes("too many requests")) {
      return "Muitas tentativas. Aguarde um pouco e tente novamente.";
    }

    return "Não foi possível entrar agora. Tente novamente.";
  };

  // ✅ Cadastro REAL (Supabase) - mantém o layout do Signup e usa alert como antes
  const handleSignup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Conta criada! Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada."
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {currentScreen === "login" && (
        <Login
          onLogin={handleLogin}
          onNavigateToSignup={() => setCurrentScreen("signup")}
        />
      )}

      {currentScreen === "signup" && (
        <Signup
          onSignup={handleSignup}
          onNavigateToLogin={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "dashboard" && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
