interface MetricsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "green" | "red" | "yellow" | "blue"; // Adicionei 'blue' aqui
  valueColor?: "green" | "red";
}

export function MetricsCard({
  icon,
  label,
  value,
  color,
  valueColor,
}: MetricsCardProps) {
  // Mapeamento de cores CSS
  const colorClasses = {
    green: "text-green-400 border-green-500",
    red: "text-red-400 border-red-500",
    blue: "text-blue-400 border-blue-500", // Corrigido para blue
    yellow: "text-yellow-400 border-yellow-500",
  };

  const bgColorClasses = {
    green: "bg-green-500/10",
    red: "bg-red-500/10",
    blue: "bg-blue-500/10", // Corrigido para blue
    yellow: "bg-yellow-500/10",
  };

  // Pegamos as classes com segurança. Se não existir, usamos verde por padrão.
  const currentTextBorder = colorClasses[color] || colorClasses.green;
  const currentBg = bgColorClasses[color] || bgColorClasses.green;

  return (
    <div
      className={`bg-[#1a2942] rounded-2xl p-4 border-b-4 ${currentTextBorder.split(" ")[1]}`}
    >
      <div
        className={`${currentBg} ${currentTextBorder.split(" ")[0]} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p
        className={`font-bold text-xl ${
          valueColor === "green"
            ? "text-green-400"
            : valueColor === "red"
              ? "text-red-400"
              : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
