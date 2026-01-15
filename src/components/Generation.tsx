import { Sun, TrendingUp, Zap, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dailyData = [
  { day: 'Dom', value: 45 },
  { day: 'Seg', value: 52 },
  { day: 'Ter', value: 48 },
  { day: 'Qua', value: 61 },
  { day: 'Qui', value: 55 },
  { day: 'Sex', value: 58 },
  { day: 'Sáb', value: 42 },
];

export function Generation() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Geração de Energia</h2>

      {/* Current Generation */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sun className="w-8 h-8 text-white" />
          <span className="text-white/80">Geração Atual</span>
        </div>
        <p className="text-5xl font-bold text-white mb-1">5.2 kW</p>
        <p className="text-white/80">Produzindo energia solar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">52.8 kWh</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Este Mês</span>
          </div>
          <p className="text-2xl font-bold text-white">1.245 kWh</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Pico Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">6.8 kW</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Economia</span>
          </div>
          <p className="text-2xl font-bold text-green-400">R$ 1.854</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-[#1a2942] rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-4">Geração Semanal (kWh)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyData}>
            <XAxis
              dataKey="day"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a2942',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${value} kWh`, 'Geração']}
            />
            <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
