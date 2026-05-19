import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  LayoutDashboard, 
  MoreHorizontal, 
  Search, 
  Target, 
  Trophy, 
  Zap,
  FileText,
  CheckCircle2
} from 'lucide-react';
import api from '../api/axios.js';
import MetricCard from '../components/analytics/MetricCard.jsx';
import { ActivityChart, CategoryBarChart } from '../components/analytics/AnalyticsCharts.jsx';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get('/analytics/stats').then((r) => r.data.data),
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['trends'],
    queryFn: () => api.get('/analytics/trends').then((r) => r.data.data),
  });

  const trendData = trends?.trends?.map((t) => ({
    date: new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: t.score,
    quiz: t.quiz,
  })) || [];

  const weakTopics = trends?.weakTopics || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (statsLoading || trendsLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-accent/20 border-b-accent rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6 lg:p-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-400 font-medium text-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span>Personal Analytics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Performance Overview</h1>
            <p className="text-surface-400 max-w-md">Track your learning progress, quiz scores, and mastery across different topics.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-surface-900/50 p-1 rounded-xl border border-white/5 shadow-inner">
              {['24h', '7d', '30d', 'All'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    timeRange === range 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-surface-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="p-2.5 rounded-xl bg-surface-900/50 border border-white/5 text-surface-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Points" 
            value={stats?.user?.points?.toLocaleString() || '0'} 
            icon={Zap} 
            color="amber"
            trend="up"
            trendValue="+12%"
            delay={1}
          />
          <MetricCard 
            title="Documents" 
            value={stats?.stats?.documentsCount || '0'} 
            icon={FileText} 
            color="blue"
            trend="up"
            trendValue="+2"
            delay={2}
          />
          <MetricCard 
            title="Quizzes Taken" 
            value={stats?.stats?.quizzesAttempted || '0'} 
            icon={CheckCircle2} 
            color="emerald"
            trend="up"
            trendValue="+5%"
            delay={3}
          />
          <MetricCard 
            title="Average Score" 
            value={`${stats?.stats?.averageScore || 0}%`} 
            icon={Target} 
            color="purple"
            trend={stats?.stats?.averageScore > 70 ? 'up' : 'down'}
            trendValue={stats?.stats?.averageScore > 70 ? '+2.4%' : '-1.5%'}
            delay={4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Study Trends - 2/3 width on desktop */}
          <motion.div 
            variants={containerVariants}
            className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BarChart3 className="w-32 h-32" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white">Learning Velocity</h2>
                <p className="text-sm text-surface-500">Your average quiz scores over the last sessions</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-surface-400 bg-surface-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last 30 Days</span>
              </div>
            </div>

            {trendData.length > 0 ? (
              <ActivityChart data={trendData} />
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-surface-600 bg-surface-950/20 rounded-2xl border border-dashed border-white/5">
                <p>Not enough data to show trends</p>
              </div>
            )}
          </motion.div>

          {/* Right Sidebar Column */}
          <div className="space-y-8">
            {/* Topic Performance */}
            <motion.div 
              variants={containerVariants}
              className="glass rounded-3xl p-6 border border-white/5"
            >
              <h2 className="text-lg font-bold text-white mb-1">Focus Areas</h2>
              <p className="text-xs text-surface-500 mb-6">Performance across your most active topics</p>
              
              {weakTopics.length > 0 ? (
                <CategoryBarChart data={weakTopics} />
              ) : (
                <div className="py-12 text-center text-surface-600 text-sm italic">
                  Complete more quizzes to see topic analytics
                </div>
              )}
            </motion.div>

            {/* Badges Section */}
            <motion.div 
              variants={containerVariants}
              className="glass rounded-3xl p-6 border border-white/5"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Achievements</h2>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              
              <div className="space-y-4">
                {stats?.user?.badges?.length > 0 ? (
                  stats.user.badges.slice(0, 3).map((badge, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-surface-900/40 border border-white/5 group hover:bg-surface-900/60 transition-colors cursor-default">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/5 text-2xl">
                        {badge.icon || '🏅'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-surface-100 group-hover:text-white transition-colors">{badge.name}</p>
                        <p className="text-xs text-surface-500 line-clamp-1">{badge.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-surface-600 text-xs">
                    No badges earned yet. Keep learning!
                  </div>
                )}
                
                {stats?.user?.badges?.length > 3 && (
                  <button className="w-full py-2 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                    View All Achievements
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Empty State / Bottom Message */}
        {trendData.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-3xl p-12 text-center border border-dashed border-white/10"
          >
            <div className="w-20 h-20 bg-surface-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
              <BarChart3 className="w-8 h-8 text-surface-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to start your journey?</h3>
            <p className="text-surface-500 max-w-md mx-auto mb-8">Take your first quiz or upload a document to generate analytics and track your learning progress over time.</p>
            <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
              Create My First Quiz
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

