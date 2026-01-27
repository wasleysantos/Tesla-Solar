import { User, Github, ChevronRight } from "lucide-react";

interface SettingsPageProps {
  user: { name: string; email: string };
}

export function SettingsPage({ user }: SettingsPageProps) {
  const githubRepoUrl = "https://github.com/wasleysantos/Tesla-Solar";
  const whatsappUrl = "https://wa.me/5598988020311";

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
        {/* Informações da Conta */}
        <button className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-green-400" />
            <span className="text-white">Informações da Conta</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Sobre o App → GitHub */}
        <a
          href={githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-white" />
            <span className="text-white">Sobre o App</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>

        {/* Ajuda e Suporte → WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between p-4 hover:bg-[#0a1628] rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Logo oficial do WhatsApp */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5"
            >
              <path
                fill="#17e663"
                d="M16 3C9.4 3 4 8.1 4 14.4c0 2.5.9 4.9 2.6 6.8L5 29l7.9-1.6c1.9 1 4.1 1.5 6.3 1.5 6.6 0 12-5.1 12-11.4C31 8.1 22.6 3 16 3z"
              />
              <path
                fill="#fff"
                d="M23.1 18.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7 0-1.3-.5-2.5-1.6c-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.2-.6.2-.2.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.1 3c.2.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.4z"
              />
            </svg>

            <div className="flex flex-col">
              <span className="text-white">Ajuda e Suporte</span>
              <span className="text-xs text-gray-400">
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>
      </div>

      {/* System Info */}
      <div className="bg-[#1a2942] rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">
          Informações do Sistema
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Versão do App</span>
            <span className="text-white font-semibold">1.0.2</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400 font-semibold">Conectado</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Última Sincronização</span>
            <span className="text-white font-semibold">Agora mesmo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
