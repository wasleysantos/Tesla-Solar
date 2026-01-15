interface MetricsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'green' | 'blue' | 'yellow';
  valueColor?: 'green';
}

export function MetricsCard({ icon, label, value, color, valueColor }: MetricsCardProps) {
  const colorClasses = {
    green: 'text-green-400 border-green-500',
    blue: 'text-blue-400 border-blue-500',
    yellow: 'text-yellow-400 border-yellow-500',
  };

  const bgColorClasses = {
    green: 'bg-green-500/10',
    blue: 'bg-blue-500/10',
    yellow: 'bg-yellow-500/10',
  };

  return (
    <div className={`bg-[#1a2942] rounded-2xl p-4 border-b-4 ${colorClasses[color].split(' ')[1]}`}>
      <div className={`${bgColorClasses[color]} ${colorClasses[color].split(' ')[0]} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`font-bold text-xl ${valueColor === 'green' ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
