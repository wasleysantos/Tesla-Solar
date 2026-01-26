import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";

type Screen = "login" | "signup" | "dashboard";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Carrega sessão ao iniciar
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Erro ao obter sessão:", error.message);
        setScreen("login");
      } else {
        setScreen(data.session ? "dashboard" : "login");
      }
      setLoading(false);
    });

    // 2) Escuta mudanças de login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setScreen(session ? "dashboard" : "login");
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628] text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {screen === "login" && (
        <Login onNavigateToSignup={() => setScreen("signup")} />
      )}

      {screen === "signup" && (
        <Signup onNavigateToLogin={() => setScreen("login")} />
      )}

      {screen === "dashboard" && (
        // Se o seu Dashboard ainda usa props, me diga que eu ajusto aqui.
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
