import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function MetricCard({ title, value, trend, trendValue, icon: Icon, color = 'blue', delay = 0 }) {
  // Generate some random sparkline data
  const sparklineData = Array.from({ length: 10 }, (_, i) => ({
    value: Math.floor(Math.random() * 40) + 60,
  }));

  const colorMap = {
    blue: 'var(--color-primary-500)',
    purple: 'var(--color-dash-accent-purple)',
    emerald: 'var(--color-success)',
    amber: 'var(--color-warning)',
    rose: 'var(--color-danger)',
  };

  const activeColor = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="card-shine glass p-5 rounded-2xl border border-[var(--border-main)] flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start z-10">
        <div className="p-2 rounded-xl bg-surface-800/50 border border-white/5">
          {Icon && <Icon className="w-5 h-5 text-surface-400 group-hover:text-white transition-colors" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-1 z-10">
        <p className="text-sm font-medium text-surface-400">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
      </div>

      <div className="h-12 w-full mt-2 absolute bottom-0 left-0 right-0 opacity-20 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={activeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={activeColor}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
