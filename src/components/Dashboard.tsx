import { useEffect, useMemo, useState } from "react";
import {
  Sun,
  Zap,
  Activity,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { PowerChart } from "./PowerChart";
import { Generation } from "./Generation";
import { Consumption } from "./Consumption";
import { Historic } from "./Historic";
import { SettingsPage } from "./SettingsPage";
import logoImage from "figma:asset/86a5dbd476eaf5850e2d574675b5ba3853e32186.png";

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

type Screen =
  | "dashboard"
  | "generation"
  | "consumption"
  | "historic"
  | "settings";

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  // Relógio
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeText = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);
  }, [now]);

  const dateText = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(now);
  }, [now]);

  const renderScreen = () => {
    switch (currentScreen) {
      case "generation":
        return <Generation />;
      case "consumption":
        return <Consumption />;
      case "historic":
        return <Historic />;
      case "settings":
        return <SettingsPage user={user} />;
      default:
        return (
          <>
            {/* Usuário + Relógio */}
            <div className="mb-3 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-gray-400">Olá,</div>
                <div className="text-sm font-semibold text-white">
                  {user.name}
                </div>
              </div>

              <div className="text-right text-gray-300">
                <div className="text-xl font-bold leading-tight">
                  {timeText}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {dateText}
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <MetricsCard
                icon={<Sun className="w-4 h-4" />}
                label="Geração"
                value="5.2 kW"
                color="green"
              />
              <MetricsCard
                icon={<Zap className="w-4 h-4" />}
                label="Consumo"
                value="3.8 kW"
                color="blue"
              />
              <MetricsCard
                icon={<Activity className="w-4 h-4" />}
                label="Temp. Inversor"
                value="42°C"
                color="yellow"
              />
              <MetricsCard
                icon={
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
                label="Status"
                value="Online"
                color="green"
                valueColor="green"
              />
            </div>

            {/* Chart */}
            <div className="bg-[#1a2942] rounded-2xl p-4 mb-6">
              <h3 className="text-white font-semibold mb-2 text-sm">
                Geração ao Longo do Tempo
              </h3>
              <div className="h-20">
                <PowerChart />
              </div>
            </div>

            {/* Botão */}
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors">
              DESLIGAR SISTEMA
            </button>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] pb-20">
      {/* Header */}
      <header className="bg-[#1a2942] px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white p-2 hover:bg-[#0a1628] rounded-lg transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* LOGO CLICÁVEL → VOLTA PARA DASHBOARD */}
        <button
          type="button"
          onClick={() => {
            setCurrentScreen("dashboard");
            setMenuOpen(false);
          }}
          aria-label="Voltar para o Dashboard"
          className="bg-transparent p-0"
        >
          <img
            src={logoImage}
            alt="Logo"
            className="h-8 object-contain cursor-pointer"
          />
        </button>

        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#1a2942] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8">
              <h2 className="text-white font-semibold mb-1">{user.name}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => {
                  setCurrentScreen("dashboard");
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentScreen === "dashboard"
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:bg-[#0a1628]"
                }`}
              >
                <Sun className="w-5 h-5" />
                Dashboard
              </button>

              <button
                onClick={() => {
                  setCurrentScreen("generation");
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentScreen === "generation"
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:bg-[#0a1628]"
                }`}
              >
                <Zap className="w-5 h-5" />
                Geração
              </button>

              <button
                onClick={() => {
                  setCurrentScreen("consumption");
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentScreen === "consumption"
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:bg-[#0a1628]"
                }`}
              >
                <Activity className="w-5 h-5" />
                Consumo
              </button>

              <button
                onClick={() => {
                  setCurrentScreen("historic");
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentScreen === "historic"
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:bg-[#0a1628]"
                }`}
              >
                <History className="w-5 h-5" />
                Histórico
              </button>

              <button
                onClick={() => {
                  setCurrentScreen("settings");
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentScreen === "settings"
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:bg-[#0a1628]"
                }`}
              >
                <Settings className="w-5 h-5" />
                Configurações
              </button>
            </nav>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-8"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="p-4">{renderScreen()}</main>
    </div>
  );
}
