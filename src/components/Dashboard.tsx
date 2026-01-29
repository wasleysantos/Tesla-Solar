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
  AlertCircle,
} from "lucide-react";

import { supabase } from "../lib/supabase";

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

type Screen = "dashboard" | "generation" | "consumption" | "historic" | "settings";

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [now, setNow] = useState(() => new Date());

  const [targetCPF, setTargetCPF] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [inputError, setInputError] = useState(false);

  // ✅ CPF não encontrado
  const [cpfNotFound, setCpfNotFound] = useState(false);

  // ✅ Nome da pessoa pelo CPF
  const [personName, setPersonName] = useState<string>("");
  const [nameNotFound, setNameNotFound] = useState(false);
  const [loadingName, setLoadingName] = useState(false);

  const [realData, setRealData] = useState({
    voltage: 0,
    current: 0,
    power: 0,
    status: "Offline" as "Online" | "Offline",
  });

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleFilter = () => {
    if (searchInput.length < 14) {
      setInputError(true);
      return;
    }
    setInputError(false);

    setCpfNotFound(false);
    setNameNotFound(false);
    setPersonName("");

    setTargetCPF(searchInput);
  };

  // ✅ Busca o último registro do CPF selecionado
  const fetchLatestData = async () => {
    if (!targetCPF) return;

    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_cpf", targetCPF)
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      setRealData({ voltage: 0, current: 0, power: 0, status: "Offline" });
      setCpfNotFound(true);
      return;
    }

    const netPower =
      (data.solar_generation || 0) - (data.house_consumption || 0);

    setRealData({
      voltage: data.voltage || 0,
      current: data.current || 0,
      power: Number(netPower.toFixed(2)),
      status: "Online",
    });

    setCpfNotFound(false);
  };

  // ✅ Busca o nome da pessoa pelo CPF (na sua tabela name/cpf)
  const fetchPersonName = async () => {
    if (!targetCPF) return;

    setLoadingName(true);

    const { data, error } = await supabase
      .from("customers") // 🔁 TROQUE para o nome real da sua tabela (a da imagem)
      .select("name")
      .eq("cpf", targetCPF)
      .limit(1)
      .single();

    if (error || !data) {
      setPersonName("");
      setNameNotFound(true);
      setLoadingName(false);
      return;
    }

    setPersonName(data.name || "");
    setNameNotFound(false);
    setLoadingName(false);
  };

  // ✅ Relógio
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // ✅ Supabase: buscar + assinar realtime
  useEffect(() => {
    let subscription: any = null;

    // sempre busca quando mudar o targetCPF
    fetchLatestData();
    fetchPersonName();

    if (targetCPF) {
      subscription = supabase
        .channel("realtime-tesla")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "measurements",
            filter: `user_cpf=eq.${targetCPF}`,
          },
          (payload) => {
            const netPower =
              (payload.new.solar_generation || 0) -
              (payload.new.house_consumption || 0);

            setRealData({
              voltage: payload.new.voltage || 0,
              current: payload.new.current || 0,
              power: Number(netPower.toFixed(2)),
              status: "Online",
            });

            setCpfNotFound(false);
          }
        )
        .subscribe();
    } else {
      setRealData({ voltage: 0, current: 0, power: 0, status: "Offline" });
      setCpfNotFound(false);

      setPersonName("");
      setNameNotFound(false);
      setLoadingName(false);
    }

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCPF]);

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
        return <Generation cpf={targetCPF} />;
      case "consumption":
        return <Consumption cpf={targetCPF} />;
      case "historic":
        return <Historic cpf={targetCPF} />;
      case "settings":
        return <SettingsPage user={user} />;
      default:
        return (
          <>
            {/* ✅ Filtro CPF */}
            <div className="mb-4">
              <div className="flex gap-3 items-center justify-center">
                <div className="w-56 sm:w-72">
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    className={`w-full bg-[#1a2942] border rounded-xl py-3 px-4 text-white text-sm text-center outline-none transition-all ${
                      inputError
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-700 focus:border-green-500"
                    }`}
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(maskCPF(e.target.value));
                      setInputError(false);
                      setCpfNotFound(false);
                      setNameNotFound(false);
                      setPersonName("");
                    }}
                  />
                </div>

                <button
                  onClick={handleFilter}
                  className="bg-green-500 hover:bg-green-600 text-[#0a1628] px-4 rounded-xl font-bold text-sm transition-all active:scale-95 py-3"
                >
                  FILTRAR
                </button>
              </div>

              {/* inválido/incompleto */}
              {inputError && (
                <div className="flex items-center gap-1 mt-2 text-yellow-400 text-[10px] font-bold uppercase tracking-wider ml-2">
                  <AlertCircle className="w-3 h-3" />
                  CPF incompleto
                </div>
              )}

              {/* CPF não encontrado (na measurements) */}
              {!inputError && cpfNotFound && targetCPF && (
                <div className="flex items-center gap-1 mt-2 text-yellow-400 text-[10px] font-bold uppercase tracking-wider ml-2">
                  <AlertCircle className="w-3 h-3" />
                  CPF não encontrado
                </div>
              )}
            </div>

            {/* CPF + NOME + Relógio */}
            <div className="mb-3 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-gray-400">Monitorando por CPF:</div>

                <div className="text-sm font-semibold text-green-400">
                  {targetCPF || "Aguardando CPF..."}
                </div>

                {/* ✅ Nome abaixo do CPF */}
                {targetCPF && (
                  <div className="text-xs text-gray-300 mt-0.5">
                    {loadingName
                      ? "Carregando nome..."
                      : personName
                        ? personName
                        : nameNotFound
                          ? "Nome não encontrado"
                          : ""}
                  </div>
                )}
              </div>

              <div className="text-right text-gray-300">
                <div className="text-xl font-bold leading-tight">{timeText}</div>
                <div className="text-xs text-gray-400 capitalize">{dateText}</div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <MetricsCard
                icon={<Sun className="w-4 h-4" />}
                label="Tensão"
                value={`${realData.voltage} V`}
                color="green"
              />
              <MetricsCard
                icon={<Zap className="w-4 h-4" />}
                label="Saldo (P)"
                value={`${realData.power} kW`}
                color="blue"
              />
              <MetricsCard
                icon={<Activity className="w-4 h-4" />}
                label="Corrente"
                value={`${realData.current} A`}
                color="yellow"
              />
              <MetricsCard
                icon={<Activity className="w-4 h-4" />}
                label="Status"
                value={realData.status}
                color={realData.status === "Online" ? "green" : "red"}
                valueColor={realData.status === "Online" ? "green" : "red"}
              />
            </div>

            {/* Chart */}
            <div className="bg-[#1a2942] rounded-2xl p-4 mb-6">
              <h3 className="text-white font-semibold mb-2 text-sm">
                Carga Atual
              </h3>
              <div className="h-20">
                <PowerChart />
              </div>
            </div>

            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors">
              DESLIGAR SISTEMA
            </button>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] pb-20">
      <header className="bg-[#1a2942] px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white p-2 hover:bg-[#0a1628] rounded-lg transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

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

      <main className="p-4">{renderScreen()}</main>
    </div>
  );
}
