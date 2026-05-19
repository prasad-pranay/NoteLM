import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Puzzle,
  TrendingUp,
  Trophy,
  Plus,
  Compass,
  History,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  MoreVertical,
  Flame,
  Gift,
  Search,
  Layout,
  Star,
  PlayCircle,
  Lock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../api/axios.js';
import { useAuthStore } from '../store/authStore.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const StatCard = ({ label, value, trend, icon: Icon, color, data }) => (
  <motion.div variants={itemVariants} className="group p-5 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all duration-300 card-shine">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[var(--text-main)] tabular-nums tracking-tight">{value}</h3>
      </div>
      <p className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </p>
    </div>
    <div className="h-16 mt-4 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data || []}>
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color.includes('blue') ? '#4F46E5' : color.includes('violet') ? '#7C3AED' : '#FBBF24'} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color.includes('blue') ? '#4F46E5' : color.includes('violet') ? '#7C3AED' : '#FBBF24'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color.includes('blue') ? '#4F46E5' : color.includes('violet') ? '#7C3AED' : '#FBBF24'}
            strokeWidth={2}
            fill={`url(#gradient-${label})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const ScoreCard = ({ score, trend }) => {
  const data = [
    { value: score },
    { value: Math.max(0, 100 - score) }
  ];
  return (
    <motion.div variants={itemVariants} className="p-5 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all duration-300 card-shine flex items-center justify-between">
      <div className="space-y-1">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
          <Trophy className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-[var(--text-muted)]">Average Score</p>
        <h3 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">{score}%</h3>
        <p className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </p>
      </div>
      <div className="w-24 h-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={30}
              outerRadius={40}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#10B981" stroke="none" />
              <Cell fill="#1E222A" stroke="none" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-[var(--text-main)]">{score}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// Helper for Activity icons
const getActivityIcon = (type) => {
  switch (type) {
    case 'document': return { icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    case 'quiz': return { icon: Puzzle, color: 'text-violet-400', bg: 'bg-violet-400/10' };
    case 'attempt': return { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' };
    default: return { icon: Layout, color: 'text-blue-400', bg: 'bg-blue-400/10' };
  }
};

const formatTimeAgo = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data.data),
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, sparklines, streak, continueLearning, recentActivity, goal, recommended } = dashboardData;
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Mon=0, Sun=6

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-[1440px] mx-auto text-[var(--text-main)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* ── Header & Streak Card ── */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          <div className="flex-1 flex flex-col justify-center py-4">

            <div className='grid grid-cols-[1fr_auto]'>


              <h2 className="text-xl md:text-3xl  tracking-tight">
                Good to see you again,
              </h2>
              <img src="/dash.png" alt="" className='row-span-3 h-30' />
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}!</span> 👋
              </h1>
              <p className="text-[var(--text-muted)] mt-3 text-base font-medium">
                Let's keep the momentum going. You've got this!
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              <Link to="/documents" className="group flex items-center gap-4 p-3 pr-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl icon-gradient-purple flex items-center justify-center flex-shrink-0">
                  {/* <Plus className="w-6 h-6 text-white" /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>

                </div>
                <div>
                  <p className="font-bold text-sm">Create Quiz</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Turn your notes into interactive quizzes</p>
                </div>
              </Link>

              <Link to="/documents" className="group flex items-center gap-4 p-3 pr-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  {/* <FileText className="w-5 h-5 text-blue-400" /> */}
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true" className='fill-blue-400 w-7  h-7 translate-x-[2px]'>
                    <path className='fill-blue-400' d="M13.862 6h-8c-.553 0-1-.448-1-1s.447-1 1-1h8c.553 0 1 .448 1 1s-.447 1-1 1zM11.862 10h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1zM10.862 13c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1z"></path>
                    <path className='fill-blue-400' d="M18.862 2v9c0 .55-.45 1-1 1s-1-.45-1-1V2.5c0-.28-.22-.5-.5-.5h-13c-.28 0-.5.22-.5.5v19c0 .28.22.5.5.5h10.5c.55 0 1 .45 1 1s-.45 1-1 1h-11c-1.1 0-2-.9-2-2V2c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z"></path>
                    <path className='fill-blue-400' d="M21.862 18c0 .55-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2h-2c-.55 0-1-.45-1-1s.45-1 1-1h2v-2c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm">Upload Document</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Upload PDF, PPT, TXT files & more</p>
                </div>
              </Link>

              <Link to="/explore" className="group flex items-center gap-4 p-3 pr-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">Explore Quizzes</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Discover quizzes from the Community</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Streak Card */}
          <div className="xl:w-[450px] p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">
                Your Learning Streak <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              </h3>
            </div>

            <div className="flex items-end gap-6 mb-8">
              <div className="text-center">
                <span className="text-5xl font-black text-[var(--text-main)]">{streak.current}</span>
                <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1">days</p>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex justify-between mb-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const isDayDone = streak.weekly[i];
                    const isToday = i === todayIndex;
                    return (
                      <div key={day + i} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">{day}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isToday ? 'border-indigo-500 bg-indigo-500/20' :
                          isDayDone ? 'border-emerald-500/50 bg-emerald-500/10' :
                            'border-white/5 bg-white/5'
                          }`}>
                          {isDayDone && <CheckCircle2 className={`w-4 h-4 ${isToday ? 'text-indigo-400' : 'text-emerald-400'}`} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                  Keep it up! Consistency is key to mastery.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[var(--border-main)]">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Longest streak: {streak.longest} days
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Documents"
            value={stats.documentsCount}
            trend="Active"
            icon={FileText}
            color="text-blue-400"
            data={sparklines.documents}
          />
          <StatCard
            label="Quizzes Created"
            value={stats.quizzesCreated}
            trend="Active"
            icon={Puzzle}
            color="text-violet-400"
            data={sparklines.quizzes}
          />
          <StatCard
            label="Quizzes Taken"
            value={stats.quizzesAttempted}
            trend="Active"
            icon={TrendingUp}
            color="text-amber-400"
            data={sparklines.attempts}
          />
          <ScoreCard
            score={Math.round(stats.averageScore)}
            trend="Overall"
          />
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold">Continue Learning</h2>
                <Link to="/documents" className="text-sm text-indigo-400 font-bold hover:text-indigo-300 transition-colors">View all</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {continueLearning.length > 0 ? continueLearning.map((item, i) => (
                  <div key={i} className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center gap-5 hover:border-white/10 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.progress || 0}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap">{item.progress || 0}% completed</span>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg bg-white/5 text-[11px] font-bold hover:bg-white/10 transition-colors">Continue</button>
                  </div>
                )) : (
                  <div className="col-span-2 p-8 text-center text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-3xl">
                    No recent documents found. Upload one to start!
                  </div>
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <Link to="/analytics" className="text-sm text-indigo-400 font-bold hover:text-indigo-300 transition-colors">View all</Link>
              </div>

              <div className="rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)] overflow-hidden">
                <div className="divide-y divide-[var(--border-main)]">
                  {recentActivity.length > 0 ? recentActivity.map((item, i) => {
                    const iconData = getActivityIcon(item.type);
                    const IconComp = iconData.icon;
                    return (
                      <div key={i} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors group">
                        <div className={`w-10 h-10 rounded-xl ${iconData.bg} flex items-center justify-center flex-shrink-0`}>
                          <IconComp className={`w-5 h-5 ${iconData.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium truncate">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-[var(--text-muted)]">{formatTimeAgo(item.createdAt)}</span>
                          <button className="p-1 hover:bg-white/5 rounded transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                      No recent activity. Start learning!
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Goal */}
            <div className="p-6 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-main)]">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-sm">Upcoming Goal</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{goal.title}</span>
                  <span className="text-[11px] font-bold text-[var(--text-muted)]">{goal.current} / {goal.target}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-black text-indigo-400">XP</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-400">Reward: +50 XP</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-sm">Achievements</h3>
                <Link to="/profile" className="text-[11px] text-indigo-400 font-bold">View all</Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Flame, label: '3 Day Streak', color: 'bg-orange-500/20 text-orange-500' },
                  { icon: Layout, label: 'Quiz Master', color: 'bg-violet-500/20 text-violet-500' },
                  { icon: FileText, label: 'First Upload', color: 'bg-emerald-500/20 text-emerald-500' },
                  { icon: Lock, label: 'Consistent Learner', color: 'bg-white/5 text-white/20' },
                ].map((ach, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center">
                    <div className={`w-12 h-12 rounded-2xl ${ach.color} flex items-center justify-center`}>
                      <ach.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-bold text-[var(--text-muted)] leading-tight">{ach.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-sm">Recommended for You</h3>
                <Link to="/explore" className="text-[11px] text-indigo-400 font-bold">View all</Link>
              </div>
              <div className="space-y-3">
                {recommended.length > 0 ? recommended.map((rec, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center gap-3 hover:border-white/10 transition-all group">
                    <div className={`w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0`}>
                      <PlayCircle className="w-6 h-6 text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{rec.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">{rec.questions} Questions</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                          {rec.rating} <Star className="w-2.5 h-2.5 fill-amber-400" />
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold hover:bg-white/10 transition-colors">Start</button>
                  </div>
                )) : (
                  <div className="p-4 text-center text-[var(--text-muted)] text-sm">
                    No recommendations yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
