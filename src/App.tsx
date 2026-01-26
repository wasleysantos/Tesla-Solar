import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { supabase } from "./lib/supabase";

type Screen = "login" | "signup" | "dashboard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Carrega sessão ao abrir o app
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) {
        setUser({
          name: (u.user_metadata?.name as string) || "Usuário",
          email: u.email || "",
        });
        setCurrentScreen("dashboard");
      }
    });

    // Escuta login/logout
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
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

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {currentScreen === "login" && (
        <Login onNavigateToSignup={() => setCurrentScreen("signup")} />
      )}

      {currentScreen === "signup" && (
        <Signup onNavigateToLogin={() => setCurrentScreen("login")} />
      )}

      {currentScreen === "dashboard" && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
