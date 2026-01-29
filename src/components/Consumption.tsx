import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Zap, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ 1. Definimos a interface para receber o CPF do Dashboard
interface ConsumptionProps {
  cpf: string;
}

export function Consumption({ cpf }: ConsumptionProps) {
  const [currentCons, setCurrentCons] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsumption = async () => {
      // Se não houver CPF, não faz a busca
      if (!cpf) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from('measurements')
        .select('timestamp, house_consumption')
        .eq('user_cpf', cpf) // ✅ FILTRO POR CPF ADICIONADO
        .order('timestamp', { ascending: true })
        .limit(10); // Pegando os últimos 10 pontos para o gráfico

      if (data && data.length > 0) {
        const formatted = data.map(d => ({
          hour: new Date(d.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
          consumption: d.house_consumption
        }));
        
        setChartData(formatted);
        // Define o consumo atual como o último registro da lista
        setCurrentCons(data[data.length - 1]?.house_consumption || 0);
      } else {
        setChartData([]);
        setCurrentCons(0);
      }
      setLoading(false);
    };

    fetchConsumption();
  }, [cpf]); // ✅ Recarrega sempre que o CPF mudar no Dashboard

  return (
    <div className="space-y-4">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-white">Consumo de Energia</h2>
        <div className="flex items-center gap-2 text-blue-400 text-xs mt-1">
          <User className="w-3 h-3" />
          <span>Monitorando: {cpf || "Nenhum cliente selecionado"}</span>
        </div>
      </div>

      {!cpf ? (
        <div className="bg-[#1a2942] rounded-2xl p-10 text-center border border-dashed border-gray-700">
          <p className="text-gray-500">Selecione um CPF no Painel Geral para visualizar os dados de consumo.</p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-white" />
              <span className="text-white/80 font-medium">Consumo Atual</span>
            </div>
            <p className="text-5xl font-bold text-white mb-1">{currentCons} kW</p>
            <p className="text-white/80 text-sm">Dados em tempo real do dispositivo</p>
          </div>

          <div className="bg-[#1a2942] rounded-2xl p-4 border border-gray-800">
            <h3 className="text-white font-semibold mb-4 text-sm">Curva de Consumo Recente (kW)</h3>
            <div className="h-[200px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a2942', border: '1px solid #374151', borderRadius: '8px' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                  Aguardando dados do banco...
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}