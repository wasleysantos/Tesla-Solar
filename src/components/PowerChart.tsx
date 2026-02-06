import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { supabase } from "../lib/supabase";

type Row = {
  id: number;
  timestamp: string;
  solar_generation: any;
  house_consumption: any;
};

function toNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function PowerChart({ cpf }: { cpf: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    const fetchChart = async () => {
      if (!cpf) {
        setRows([]);
        setDbError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setDbError("");

      const { data, error } = await supabase
        .from("measurements")
        .select("id,timestamp,solar_generation,house_consumption")
        .eq("user_cpf", cpf)
        .order("id", { ascending: false }) // ✅ seguro no seu schema
        .limit(12);

      if (error) {
        console.error("PowerChart measurements error:", error);
        setDbError(error.message || "Erro ao consultar measurements");
        setRows([]);
        setLoading(false);
        return;
      }

      setRows((data as Row[]) || []);
      setLoading(false);
    };

    fetchChart();
  }, [cpf]);

  const chartData = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    // veio DESC -> inverte para mostrar no tempo crescente
    const ordered = [...rows].reverse();

    return ordered.map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      generation: toNum(r.solar_generation),
      consumption: toNum(r.house_consumption),
    }));
  }, [rows]);

  if (!cpf) {
    return (
      <div className="h-20 flex items-center justify-center text-gray-600 text-xs">
        Selecione um CPF para ver o gráfico.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-20 flex items-center justify-center text-gray-400 text-xs animate-pulse">
        Carregando gráfico...
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="h-20 flex items-center justify-center text-red-400 text-xs">
        Erro no gráfico: {dbError}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-20 flex items-center justify-center text-gray-600 text-xs">
        Sem dados para este CPF.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
          </linearGradient>

          <linearGradient id="consGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#db1111" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#db1111" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="time"
          stroke="#64748b"
          style={{ fontSize: "12px" }}
          tickLine={false}
        />
        <YAxis stroke="#64748b" style={{ fontSize: "12px" }} tickLine={false} />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1a2942",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#fff",
          }}
        />

        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          iconType="line"
        />

        <Area
          type="monotone"
          dataKey="generation"
          name="Geração"
          stroke="#22c55e"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#genGradient)"
        />

        <Area
          type="monotone"
          dataKey="consumption"
          name="Consumo"
          stroke="#db1111"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#consGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
