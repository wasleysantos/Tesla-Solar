import { Home, Tv, Wind, Lightbulb, Wifi, Power } from 'lucide-react';

const devices = [
  {
    name: 'Ar Condicionado',
    icon: <Wind className="w-6 h-6" />,
    status: true,
    consumption: '2.1 kW',
    room: 'Sala',
  },
  {
    name: 'Smart TV',
    icon: <Tv className="w-6 h-6" />,
    status: true,
    consumption: '0.3 kW',
    room: 'Sala',
  },
  {
    name: 'Iluminação',
    icon: <Lightbulb className="w-6 h-6" />,
    status: true,
    consumption: '0.2 kW',
    room: 'Cozinha',
  },
  {
    name: 'Ar Condicionado',
    icon: <Wind className="w-6 h-6" />,
    status: false,
    consumption: '0 kW',
    room: 'Quarto 1',
  },
  {
    name: 'Roteador Wi-Fi',
    icon: <Wifi className="w-6 h-6" />,
    status: true,
    consumption: '0.05 kW',
    room: 'Escritório',
  },
  {
    name: 'Iluminação',
    icon: <Lightbulb className="w-6 h-6" />,
    status: false,
    consumption: '0 kW',
    room: 'Quarto 2',
  },
];

export function Devices() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Dispositivos</h2>

      {/* Summary */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-8 h-8 text-white" />
          <span className="text-white/80">Dispositivos Ativos</span>
        </div>
        <p className="text-5xl font-bold text-white mb-1">4 / 6</p>
        <p className="text-white/80">Consumindo 2.65 kW no total</p>
      </div>

      {/* Devices List */}
      <div className="space-y-3">
        {devices.map((device, index) => (
          <div
            key={index}
            className="bg-[#1a2942] rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  device.status
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {device.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold">{device.name}</h3>
                <p className="text-gray-400 text-sm">{device.room}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-white font-semibold mb-1">{device.consumption}</p>
              <button
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  device.status
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {device.status ? 'Ligado' : 'Desligado'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Device Button */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
        <Power className="w-5 h-5" />
        Adicionar Dispositivo
      </button>
    </div>
  );
}
