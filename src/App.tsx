import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { ResetPassword } from "./components/ResetPassword";
import { ForgotPassword } from "./components/ForgotPassword";
import { supabase } from "./lib/supabase";

type Screen =
  | "login"
  | "signup"
  | "dashboard"
  | "forgot-password"
  | "reset-password"
  | "settings"
  | "customer_register";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // ✅ novo: CPF selecionado na base
  const [selectedCpf, setSelectedCpf] = useState<string>("");

  // ✅ Detecta rota simples sem React Router
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/reset-password") {
      setCurrentScreen("reset-password");
    }
  }, []);

  // Carrega sessão do Supabase ao iniciar + escuta mudanças de login/logout
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao obter sessão:", error.message);
        setUser(null);

        setCurrentScreen((prev) =>
          prev === "reset-password" ? prev : "login",
        );

        setLoading(false);
        return;
      }

      const u = data.session?.user;
      if (u) {
        setUser({
          name: (u.user_metadata?.name as string) || "Usuário",
          email: u.email || "",
        });

        setCurrentScreen((prev) =>
          prev === "reset-password" ? prev : "dashboard",
        );
      } else {
        setUser(null);

        setCurrentScreen((prev) =>
          prev === "reset-password" ? prev : "login",
        );
      }

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user;

        if (u) {
          setUser({
            name: (u.user_metadata?.name as string) || "Usuário",
            email: u.email || "",
          });

          setCurrentScreen((prev) =>
            prev === "reset-password" ? prev : "dashboard",
          );
        } else {
          setUser(null);

          setCurrentScreen((prev) =>
            prev === "reset-password" ? prev : "login",
          );
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Login REAL (Supabase)
  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) return null;

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

  // ✅ Login com Google (Supabase OAuth)
  const handleGoogleLogin = async (): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) {
      console.error("Erro Google OAuth:", error.message);
      return "Erro ao iniciar login com Google.";
    }

    return null;
  };

  // ✅ Cadastro REAL (Supabase)
  const handleSignup = async (
    name: string,
    email: string,
    password: string,
  ) => {
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
      "Conta criada! Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada.",
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ✅ Ao concluir reset, volta para login e limpa a rota
  const handleResetDone = () => {
    window.history.replaceState({}, "", "/");
    setCurrentScreen("login");
  };

  // ✅ voltar do forgot para login
  const handleBackToLogin = () => {
    setCurrentScreen("login");
  };

  // ✅ Selecionou cliente -> salva cpf e vai pro dashboard
  const handleSelectCpf = (cpf: string) => {
    setSelectedCpf(cpf);
    setCurrentScreen("dashboard");
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
      {currentScreen === "reset-password" && (
        <ResetPassword onDone={handleResetDone} />
      )}

      {currentScreen === "forgot-password" && (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      )}

      {currentScreen === "login" && (
        <Login
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          // ✅ se você não quer signup na tela, pode remover isso no Login.tsx também
          onNavigateToSignup={() => setCurrentScreen("signup")}
          onNavigateToForgotPassword={() => setCurrentScreen("forgot-password")}
        />
      )}

      {currentScreen === "signup" && (
        <Signup
          onSignup={handleSignup}
          onNavigateToLogin={() => setCurrentScreen("login")}
        />
      )}

      {currentScreen === "dashboard" && user && (
        <Dashboard
          user={user}
          cpf={selectedCpf} // ✅ aqui vai o CPF selecionado
          onLogout={handleLogout}
          onNavigate={(page: "settings" | "customer_register" | "dashboard") =>
            setCurrentScreen(page)
          }
          onSelectCpf={handleSelectCpf} // ✅ opcional: se o Dashboard também trocar cliente
        />
      )}
    </div>
  );
}
