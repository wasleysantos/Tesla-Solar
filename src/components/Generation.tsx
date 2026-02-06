import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Sun, User } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GenerationProps {
  cpf: string; // (já vem limpo do Dashboard)
}

export function Generation({ cpf }: GenerationProps) {
  const [currentGen, setCurrentGen] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    const fetchGeneration = async () => {
      if (!cpf) {
        setLoading(false);
        setDbError("");
        setChartData([]);
        setCurrentGen(0);
        return;
      }

      setLoading(true);
      setDbError("");

      const { data, error } = await supabase
        .from("measurements")
        .select("timestamp, solar_generation")
        .eq("user_cpf", cpf)
        // ✅ pega as últimas 7 leituras (mais recentes)
        .order("timestamp", { ascending: false })
        .limit(7);

      if (error) {
        console.error("Generation measurements error:", error);
        setDbError(error.message || "Erro ao consultar measurements");
        setChartData([]);
        setCurrentGen(0);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // ✅ como veio DESC, inverte para o gráfico ficar no tempo crescente
        const ordered = [...data].reverse();

        const formatted = ordered.map((d: any) => ({
          time: new Date(d.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: Number(d.solar_generation) || 0,
        }));

        setChartData(formatted);

        // ✅ "atual" é o último item do array crescente
        setCurrentGen(formatted[formatted.length - 1]?.value || 0);
      } else {
        setChartData([]);
        setCurrentGen(0);
      }

      setLoading(false);
    };

    fetchGeneration();
  }, [cpf]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-white">Geração de Energia</h2>

        <div className="flex items-center gap-2 text-green-400 text-xs mt-1">
          <User className="w-3 h-3" />
          <span>Cliente: {cpf || "Aguardando seleção..."}</span>
        </div>

        {dbError && (
          <div className="flex items-center gap-1 mt-2 text-red-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Erro:</span> {dbError}
          </div>
        )}
      </div>

      {!cpf ? (
        <div className="bg-[#1a2942] rounded-2xl p-10 text-center border border-dashed border-gray-700">
          <p className="text-gray-500 text-sm">
            Insira o CPF no painel principal para carregar os dados solares.
          </p>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-white animate-pulse">
          Consultando banco de dados...
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg shadow-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Sun className="w-8 h-8 text-white" />
              <span className="text-white/80 font-medium">Geração Atual</span>
            </div>

            <p className="text-5xl font-bold text-white mb-1">
              {currentGen} kW
            </p>
            <p className="text-white/80 text-sm">
              Produzindo via Painéis Fotovoltaicos
            </p>
          </div>

          <div className="bg-[#1a2942] rounded-2xl p-4 border border-gray-800">
            <h3 className="text-white font-semibold mb-4 text-sm">
              Produção nas Últimas Leituras
            </h3>

            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis stroke="#64748b" style={{ fontSize: "10px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a2942",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#22c55e" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                  Sem dados de geração para este CPF.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
