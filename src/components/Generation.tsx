import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Sun, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ 1. Interface para receber o CPF do Dashboard
interface GenerationProps {
  cpf: string;
}

export function Generation({ cpf }: GenerationProps) {
  const [currentGen, setCurrentGen] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneration = async () => {
      if (!cpf) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from('measurements')
        .select('timestamp, solar_generation')
        .eq('user_cpf', cpf) // ✅ FILTRO POR CPF APLICADO
        .order('timestamp', { ascending: true })
        .limit(7);

      if (data && data.length > 0) {
        const formatted = data.map(d => ({
          // Exibe a hora para monitoramento em tempo real ou dia da semana
          time: new Date(d.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
          value: d.solar_generation
        }));
        setChartData(formatted);
        setCurrentGen(data[data.length - 1]?.solar_generation || 0);
      } else {
        setChartData([]);
        setCurrentGen(0);
      }
      setLoading(false);
    };

    fetchGeneration();
  }, [cpf]); // ✅ Monitora a troca de cliente

  return (
    <div className="space-y-4">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-white">Geração de Energia</h2>
        <div className="flex items-center gap-2 text-green-400 text-xs mt-1">
          <User className="w-3 h-3" />
          <span>Cliente: {cpf || "Aguardando seleção..."}</span>
        </div>
      </div>

      {!cpf ? (
        <div className="bg-[#1a2942] rounded-2xl p-10 text-center border border-dashed border-gray-700">
          <p className="text-gray-500 text-sm">Insira o CPF no painel principal para carregar os dados solares.</p>
        </div>
      ) : (
        <>
          {/* Card de Geração Real */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg shadow-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Sun className="w-8 h-8 text-white" />
              <span className="text-white/80 font-medium">Geração Atual</span>
            </div>
            <p className="text-5xl font-bold text-white mb-1">{currentGen} kW</p>
            <p className="text-white/80 text-sm">Produzindo via Painéis Fotovoltaicos</p>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-[#1a2942] rounded-2xl p-4 border border-gray-800">
            <h3 className="text-white font-semibold mb-4 text-sm">Produção nas Últimas Leituras</h3>
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2942', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#22c55e' }}
                    />
                    <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
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