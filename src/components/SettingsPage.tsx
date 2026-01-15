import { User, Bell, Shield, Info, ChevronRight } from 'lucide-react';

interface SettingsPageProps {
  user: { name: string; email: string };
}

export function SettingsPage({ user }: SettingsPageProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Configurações</h2>

      {/* User Profile */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors">
          Editar Perfil
        </button>
      </div>

      {/* Settings Options */}
      <div className="bg-[#1a2942] rounded-2xl p-4">
        <button className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-green-400" />
            <span className="text-white">Informações da Conta</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-400" />
            <span className="text-white">Notificações</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-white">Privacidade e Segurança</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-yellow-400" />
            <span className="text-white">Sobre o App</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* System Info */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Informações do Sistema</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Versão do App</span>
            <span className="text-white font-semibold">2.5.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sistema Solar</span>
            <span className="text-green-400 font-semibold">Conectado</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Último Sincronização</span>
            <span className="text-white font-semibold">Agora mesmo</span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Ajuda e Suporte</h3>
        <div className="space-y-2">
          <button className="w-full text-left text-green-400 hover:text-green-300 py-2">
            Central de Ajuda
          </button>
          <button className="w-full text-left text-green-400 hover:text-green-300 py-2">
            Reportar Problema
          </button>
          <button className="w-full text-left text-green-400 hover:text-green-300 py-2">
            Termos de Uso
          </button>
          <button className="w-full text-left text-green-400 hover:text-green-300 py-2">
            Política de Privacidade
          </button>
        </div>
      </div>
    </div>
  );
}
