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
      if (!error) {
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

  // Login REAL (Supabase) - chamado pelo seu Login.tsx (sem mudar o layout)
  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    }
    // Se deu certo, o onAuthStateChange acima leva pro dashboard
  };

  // Cadastro REAL (Supabase) - chamado pelo seu Signup.tsx (sem mudar o layout)
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

    // Se a confirmação por e-mail estiver ativa no Supabase:
    // o usuário precisa confirmar e depois fazer login.
    alert("Conta criada! Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange já volta para login
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
