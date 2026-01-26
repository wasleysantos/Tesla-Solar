import { useState } from "react";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "login" | "signup" | "dashboard"
  >("login");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  const handleLogin = (email: string, password: string) => {
    // Mock login
    setUser({ name: "Usuário", email });
    setCurrentScreen("dashboard");
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // Mock signup
    setUser({ name, email });
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen("login");
  };

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
