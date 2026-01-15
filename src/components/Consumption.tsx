import { Zap, TrendingDown, Home, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const hourlyData = [
  { hour: '00h', consumption: 1.2 },
  { hour: '04h', consumption: 0.8 },
  { hour: '08h', consumption: 2.5 },
  { hour: '12h', consumption: 4.2 },
  { hour: '16h', consumption: 3.8 },
  { hour: '20h', consumption: 5.1 },
  { hour: '23h', consumption: 2.3 },
];

export function Consumption() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Consumo de Energia</h2>

      {/* Current Consumption */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-white" />
          <span className="text-white/80">Consumo Atual</span>
        </div>
        <p className="text-5xl font-bold text-white mb-1">3.8 kW</p>
        <p className="text-white/80">Consumindo da rede solar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">38.5 kWh</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Este Mês</span>
          </div>
          <p className="text-2xl font-bold text-white">892 kWh</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Pico Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">5.4 kW</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 text-sm">Custo Mês</span>
          </div>
          <p className="text-2xl font-bold text-white">R$ 312</p>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="bg-[#1a2942] rounded-2xl p-4">
        <h3 className="text-white font-semibold mb-4">Consumo nas Últimas 24h</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hourlyData}>
            <XAxis
              dataKey="hour"
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
              formatter={(value: number) => [`${value} kW`, 'Consumo']}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Energy Balance */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Balanço Energético Hoje</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Geração Solar</span>
              <span className="text-green-400 font-semibold">52.8 kWh</span>
            </div>
            <div className="w-full bg-[#0a1628] rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Consumo Total</span>
              <span className="text-blue-400 font-semibold">38.5 kWh</span>
            </div>
            <div className="w-full bg-[#0a1628] rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '53%' }}></div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Saldo do Dia</span>
              <span className="text-2xl font-bold text-green-400">+14.3 kWh</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Você gerou mais energia do que consumiu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
