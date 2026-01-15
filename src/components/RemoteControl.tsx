import { Power, Moon, Sun, Thermometer, Zap } from 'lucide-react';
import { useState } from 'react';

export function RemoteControl() {
  const [autoMode, setAutoMode] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [temperature, setTemperature] = useState(22);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Controle Remoto</h2>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setAutoMode(!autoMode)}
          className={`rounded-xl p-6 transition-all ${
            autoMode
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-[#1a2942] border-2 border-gray-700'
          }`}
        >
          <Zap className={`w-8 h-8 mb-3 ${autoMode ? 'text-white' : 'text-gray-400'}`} />
          <p className={`font-semibold ${autoMode ? 'text-white' : 'text-gray-400'}`}>
            Modo Auto
          </p>
          <p className={`text-sm ${autoMode ? 'text-white/80' : 'text-gray-500'}`}>
            {autoMode ? 'Ativado' : 'Desativado'}
          </p>
        </button>

        <button
          onClick={() => setNightMode(!nightMode)}
          className={`rounded-xl p-6 transition-all ${
            nightMode
              ? 'bg-gradient-to-br from-purple-500 to-purple-600'
              : 'bg-[#1a2942] border-2 border-gray-700'
          }`}
        >
          <Moon className={`w-8 h-8 mb-3 ${nightMode ? 'text-white' : 'text-gray-400'}`} />
          <p className={`font-semibold ${nightMode ? 'text-white' : 'text-gray-400'}`}>
            Modo Noturno
          </p>
          <p className={`text-sm ${nightMode ? 'text-white/80' : 'text-gray-500'}`}>
            {nightMode ? 'Ativado' : 'Desativado'}
          </p>
        </button>
      </div>

      {/* Temperature Control */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Thermometer className="w-6 h-6 text-orange-400" />
          <h3 className="text-white font-semibold">Controle de Temperatura</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <p className="text-6xl font-bold text-white">{temperature}°C</p>
            <p className="text-gray-400 mt-2">Temperatura ambiente</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTemperature(Math.max(16, temperature - 1))}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            -
          </button>
          <button
            onClick={() => setTemperature(Math.min(30, temperature + 1))}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* System Control */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Controle do Sistema</h3>
        
        <div className="space-y-3">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Power className="w-5 h-5" />
            Ligar Todos Dispositivos
          </button>
          
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Moon className="w-5 h-5" />
            Modo Economia
          </button>
          
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Power className="w-5 h-5" />
            Desligar Todos Dispositivos
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Agendamentos</h3>
          <button className="text-green-400 hover:text-green-300 text-sm font-semibold">
            + Novo
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-[#0a1628] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold">Ar Condicionado - Sala</p>
              <span className="text-green-400 text-sm">Ativo</span>
            </div>
            <p className="text-gray-400 text-sm">Ligar às 18:00 • Desligar às 22:00</p>
          </div>

          <div className="bg-[#0a1628] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold">Iluminação Externa</p>
              <span className="text-green-400 text-sm">Ativo</span>
            </div>
            <p className="text-gray-400 text-sm">Ligar ao anoitecer • Desligar ao amanhecer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
