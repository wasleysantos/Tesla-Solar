import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { time: '00:00', power: 0, consumption: 1.2 },
  { time: '03:00', power: 0, consumption: 0.8 },
  { time: '06:00', power: 1.2, consumption: 1.5 },
  { time: '09:00', power: 4.5, consumption: 2.8 },
  { time: '12:00', power: 6.8, consumption: 4.2 },
  { time: '15:00', power: 5.2, consumption: 3.8 },
  { time: '18:00', power: 2.1, consumption: 4.5 },
  { time: '21:00', power: 0, consumption: 3.2 },
  { time: '22:00', power: 0, consumption: 2.1 },
];

export function PowerChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#db1111" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#db1111" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          stroke="#64748b"
          style={{ fontSize: '12px' }}
          tickLine={false}
        />
        <YAxis
          stroke="#64748b"
          style={{ fontSize: '12px' }}
          tickLine={false}
          domain={[0, 8]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a2942',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          iconType="line"
        />
        <Area
          type="monotone"
          dataKey="power"
          name="Geração"
          stroke="#22c55e"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#powerGradient)"
        />
        <Area
          type="monotone"
          dataKey="consumption"
          name="Consumo"
          stroke="#db1111"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#consumptionGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}