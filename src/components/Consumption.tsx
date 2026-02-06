import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Zap, User } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ConsumptionProps {
  cpf: string; // (já vem limpo do Dashboard)
}

export function Consumption({ cpf }: ConsumptionProps) {
  const [currentCons, setCurrentCons] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    const fetchConsumption = async () => {
      if (!cpf) {
        setLoading(false);
        setDbError("");
        setChartData([]);
        setCurrentCons(0);
        return;
      }

      setLoading(true);
      setDbError("");

      const { data, error } = await supabase
        .from("measurements")
        .select("timestamp, house_consumption")
        .eq("user_cpf", cpf)
        // ✅ pega os últimos 10 pontos (mais recentes)
        .order("timestamp", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Consumption measurements error:", error);
        setDbError(error.message || "Erro ao consultar measurements");
        setChartData([]);
        setCurrentCons(0);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // ✅ veio DESC -> inverte para plotar em ordem crescente
        const ordered = [...data].reverse();

        const formatted = ordered.map((d: any) => ({
          hour: new Date(d.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          consumption: Number(d.house_consumption) || 0,
        }));

        setChartData(formatted);
        setCurrentCons(formatted[formatted.length - 1]?.consumption || 0);
      } else {
        setChartData([]);
        setCurrentCons(0);
      }

      setLoading(false);
    };

    fetchConsumption();
  }, [cpf]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-white">Consumo de Energia</h2>

        <div className="flex items-center gap-2 text-blue-400 text-xs mt-1">
          <User className="w-3 h-3" />
          <span>Monitorando: {cpf || "Nenhum cliente selecionado"}</span>
        </div>

        {dbError && (
          <div className="flex items-center gap-1 mt-2 text-red-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Erro:</span> {dbError}
          </div>
        )}
      </div>

      {!cpf ? (
        <div className="bg-[#1a2942] rounded-2xl p-10 text-center border border-dashed border-gray-700">
          <p className="text-gray-500">
            Selecione um CPF no Painel Geral para visualizar os dados de
            consumo.
          </p>
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-white animate-pulse">
          Consultando banco de dados...
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-white" />
              <span className="text-white/80 font-medium">Consumo Atual</span>
            </div>

            <p className="text-5xl font-bold text-white mb-1">
              {currentCons} kW
            </p>
            <p className="text-white/80 text-sm">
              Dados em tempo real do dispositivo
            </p>
          </div>

          <div className="bg-[#1a2942] rounded-2xl p-4 border border-gray-800">
            <h3 className="text-white font-semibold mb-4 text-sm">
              Curva de Consumo Recente (kW)
            </h3>

            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="hour"
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
                      itemStyle={{ color: "#3b82f6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                  Sem dados de consumo para este CPF.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
