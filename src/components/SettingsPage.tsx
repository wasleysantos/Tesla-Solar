import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import {
  User,
  Github,
  ChevronRight,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Search,
  MapPin,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface SettingsPageProps {
  user: { name: string; email: string };
  onSelectCpf?: (cpf: string) => void;
}

// ✅ helpers CPF
function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

function formatCpf(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);

  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

function formatCep(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 8);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 8);

  if (part2) return `${part1}-${part2}`;
  return part1;
}

// ✅ validação CPF (dígitos verificadores)
function isValidCPF(cpf: string) {
  const clean = onlyDigits(cpf);
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(clean[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(clean[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(clean[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  if (d2 !== Number(clean[10])) return false;

  return true;
}

export function SettingsPage({ user, onSelectCpf }: SettingsPageProps) {
  const githubRepoUrl = "https://github.com/wasleysantos/Tesla-Solar";
  const whatsappUrl = "https://wa.me/5598988020311";
  const appVersion = "";

  // Estados do Cadastro
  const [newName, setNewName] = useState("");
  const [newCpf, setNewCpf] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newZip, setNewZip] = useState("");
  const [newState, setNewState] = useState("");
  const [newCity, setNewCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("name", { ascending: true });
    if (data) setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Auto-preencher Endereço/Cidade/UF via CEP (viaCEP)
  const fetchAddressByCep = async (zipRaw: string) => {
  const zip = (zipRaw || "").replace(/\D/g, "");
  if (zip.length !== 8) return;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
    const data = await res.json();

    if (!data?.erro) {
      const logradouro = data.logradouro || "";
      const bairro = data.bairro || "";

      setNewCity(data.localidade || "");
      setNewState((data.uf || "").toUpperCase());

      const sugerido = [logradouro, bairro].filter(Boolean).join(" - ");
      if (!newAddress.trim() && sugerido) {
        setNewAddress(sugerido);
      }
    }
  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
  }
};


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const cpfDigits = onlyDigits(newCpf);

    if (!isValidCPF(cpfDigits)) {
      setStatus({ type: "error", msg: "CPF inválido. Verifique os dígitos." });
      setLoading(false);
      return;
    }

    const payload: any = {
      name: newName.trim(),
      cpf: cpfDigits,
      email: newEmail.trim() || null,
      address: newAddress.trim() || null,
      zip_code: newZip.trim() || null,
      state: newState.trim().toUpperCase() || null,
      city: newCity.trim() || null,
    };

    const { error } = await supabase
      .from("customers")
      .upsert([payload], { onConflict: "cpf" });

    if (error) {
      setStatus({
        type: "error",
        msg: "Erro ao salvar. Verifique se o CPF é único e se as colunas existem no Supabase.",
      });
    } else {
      setStatus({
        type: "success",
        msg: "Cliente cadastrado/atualizado com sucesso!",
      });
      setNewName("");
      setNewCpf("");
      setNewEmail("");
      setNewAddress("");
      setNewZip("");
      setNewCity("");
      setNewState("");
      fetchCustomers();
    }

    setLoading(false);
  };

  const filteredCustomers = customers.filter((c) => {
    const cpfMasked = formatCpf(c.cpf || "");
    return [c.name, c.cpf, cpfMasked, c.city, c.email].some((f) =>
      String(f || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  });

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header mais “premium” */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white leading-tight">
            Configurações
          </h2>
          <p className="text-gray-400 text-sm">
            Gerencie sua base de clientes.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span className="px-2 py-1 rounded-lg bg-[#0a1628] border border-gray-800">
            {appVersion}
          </span>
        </div>
      </div>

      {/* 1. PERFIL DO ADMINISTRADOR */}
      <div className="bg-[#1a2942] rounded-2xl p-4 border border-gray-800">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {user.name}
            </h3>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>
        </div>

        <div className="mt-1">..</div>

        {/* Selo de Administrador */}
        <div
          className="flex items-center justify-center gap-2 px-2 py-2 rounded-xl 
                  bg-green-500/10 border border-green-500/20"
        >
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold text-green-300">
            Administrador do Sistema
          </span>
        </div>
      </div>

      {/* 2 + 3 em grid (melhor em telas maiores, sem mudar lógica) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. CADASTRO DE CLIENTES (layout moderno) */}
        <div className="bg-[#1a2942] rounded-2xl border border-green-500/20 overflow-hidden">
          <div className="p-6 border-b border-gray-800/60">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-400" />
              Cadastrar Cliente
            </h3>
          </div>

          <form onSubmit={handleRegister} className="p-4 sm:p-6 space-y-4">
            {/* Nome */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Nome completo</label>
              <input
                className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500"
                placeholder="Ex: Maria Silva"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            {/* CPF + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">CPF</label>
                <input
                  className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500 text-center tracking-wider"
                  placeholder="000.000.000-00"
                  value={newCpf}
                  onChange={(e) => setNewCpf(formatCpf(e.target.value))}
                  inputMode="numeric"
                  maxLength={14}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">E-mail</label>
                <input
                  className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500"
                  placeholder="cliente@email.com"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Endereço</label>
              <input
                className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500"
                placeholder="Rua, Nº, Bairro"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>

            {/* CEP + UF */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-gray-400">CEP</label>
                <input
  className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500"
  placeholder="00000-000"
  inputMode="numeric"
  value={newZip}
  onChange={(e) => {
    const formatted = formatCep(e.target.value);
    setNewZip(formatted);

    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      fetchAddressByCep(digits);
    }
  }}
/>



              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">UF</label>
                <input
                  className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500 text-center uppercase"
                  placeholder="UF"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value.toUpperCase())}
                  maxLength={2}
                />
              </div>
            </div>

            {/* Cidade */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Cidade</label>
              <input
                className="w-full bg-[#0a1628] border border-gray-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-green-500"
                placeholder="Ex: São Luis"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
            </div>

            {/* Botão + status */}
            <div className="pt-2 space-y-3">
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-[#0a1628] font-bold px-4 py-2 text-sm rounded-xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/10 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "SALVANDO..." : "SALVAR CLIENTE"}
                </button>
              </div>

              {status && (
                <div
                  className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border ${
                    status.type === "success"
                      ? "text-green-300 border-green-500/20 bg-green-500/10"
                      : "text-red-300 border-red-500/20 bg-red-500/10"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="leading-snug">{status.msg}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* 3. BASE DE MONITORAMENTO (layout moderno) */}
        <div className="bg-[#1a2942] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800/60">
            <h3 className="text-white font-semibold">Base de Monitoramento</h3>
            <p className="text-xs text-gray-400 mt-1">
              Pesquise e selecione rapidamente um CPF para monitorar.
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="    Buscar por nome, CPF, e-mail ou cidade..."
                className="w-full bg-[#0a1628] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* “Resumo” */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Resultados:{" "}
                <span className="text-gray-200 font-semibold">
                  {filteredCustomers.length}
                </span>
              </span>
              <span className="hidden sm:inline">
                Total:{" "}
                <span className="text-gray-200 font-semibold">
                  {customers.length}
                </span>
              </span>
            </div>

            {/* Lista */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  className="group flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-800 bg-[#0a1628]/50 hover:bg-[#0a1628]/70 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-blue-300" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {c.name}
                      </p>
                      <p className="text-gray-500 text-[11px] leading-snug">
                        {formatCpf(c.cpf || "")}
                        {c.city || c.state ? (
                          <>
                            {" "}
                            • {c.city || "-"}
                            {c.state ? `/${c.state}` : ""}
                          </>
                        ) : null}
                        {c.email ? ` • ${c.email}` : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCpf?.(onlyDigits(c.cpf || ""))}
                    className="shrink-0 px-3 py-2 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                    title="Selecionar CPF"
                    type="button"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-semibold">
                      Selecionar
                    </span>
                  </button>
                </div>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="text-center py-10">
                  <div className="text-gray-300 text-sm font-semibold">
                    Nada encontrado
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Tente outro nome/CPF ou limpe o campo de busca.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Options (mantido, só leve ajuste de espaçamento/hover) */}
      <div className="bg-[#1a2942] rounded-2xl p-4 border border-gray-800">
        <button className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-green-400" />
            <span className="text-white">Informações da Conta</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <a
          href={githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-white" />
            <span className="text-white">Sobre o App</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5"
            >
              <path
                fill="#17e663"
                d="M16 3C9.4 3 4 8.1 4 14.4c0 2.5.9 4.9 2.6 6.8L5 29l7.9-1.6c1.9 1 4.1 1.5 6.3 1.5 6.6 0 12-5.1 12-11.4C31 8.1 22.6 3 16 3z"
              />
              <path
                fill="#fff"
                d="M23.1 18.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7 0-1.3-.5-2.5-1.6c-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.2-.6.2-.2.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.1 3c.2.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.4z"
              />
            </svg>

            <div className="flex flex-col">
              <span className="text-white">Ajuda e Suporte</span>
              <span className="text-xs text-gray-400"></span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>
      </div>

      {/* System Info */}
      <div className="bg-[#1a2942] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-white font-semibold mb-4">
          Informações do Sistema
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Versão do App</span>
            <span className="text-white font-semibold">2.0</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400 font-semibold">Online</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Banco de dados</span>
            <span className="text-white font-semibold">Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
