import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';

const historyData = [
  { month: 'Janeiro', generation: 1580, consumption: 1320, balance: 260, cost: 'R$ 245' },
  { month: 'Fevereiro', generation: 1420, consumption: 1280, balance: 140, cost: 'R$ 298' },
  { month: 'Março', generation: 1650, consumption: 1180, balance: 470, cost: 'R$ 187' },
  { month: 'Abril', generation: 1380, consumption: 1420, balance: -40, cost: 'R$ 412' },
  { month: 'Maio', generation: 1520, consumption: 1350, balance: 170, cost: 'R$ 268' },
  { month: 'Junho', generation: 1245, consumption: 892, balance: 353, cost: 'R$ 312' },
];

export function Historic() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Histórico</h2>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Total Gerado</span>
          </div>
          <p className="text-2xl font-bold text-white">8.795 kWh</p>
          <p className="text-green-400 text-sm mt-1">Últimos 6 meses</p>
        </div>

        <div className="bg-[#1a2942] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Total Consumido</span>
          </div>
          <p className="text-2xl font-bold text-white">7.442 kWh</p>
          <p className="text-blue-400 text-sm mt-1">Últimos 6 meses</p>
        </div>
      </div>

      {/* Monthly History */}
      <div className="space-y-3">
        {historyData.reverse().map((item, index) => (
          <div key={index} className="bg-[#1a2942] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">{item.month}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.balance >= 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {item.balance >= 0 ? '+' : ''}{item.balance} kWh
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Geração</p>
                <p className="text-white font-semibold">{item.generation} kWh</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Consumo</p>
                <p className="text-white font-semibold">{item.consumption} kWh</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Custo</p>
                <p className="text-white font-semibold">{item.cost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
