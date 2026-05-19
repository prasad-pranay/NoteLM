import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineMagnifyingGlass, 
  HiOutlineUsers,
  HiOutlinePlay,
  HiOutlineHashtag,
  HiOutlinePlus,
  HiOutlineChevronDown,
  HiOutlineListBullet,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineChartBar,
  HiOutlineEllipsisVertical,
  HiOutlineTrash,
  HiOutlineDocumentText
} from 'react-icons/hi2';
import { 
  SiJavascript, 
  SiPython, 
  SiReact, 
  SiFlask 
} from 'react-icons/si';
import { GiAtom } from 'react-icons/gi';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

// Helper for subject icons
const SubjectIcon = ({ topic = '', className = "" }) => {
  const t = topic.toLowerCase();
  if (t.includes('javascript') || t.includes('js')) return <SiJavascript className={`text-[#F7DF1E] ${className}`} />;
  if (t.includes('python')) return <SiPython className={`text-[#3776AB] ${className}`} />;
  if (t.includes('react')) return <SiReact className={`text-[#61DAFB] ${className}`} />;
  if (t.includes('science') || t.includes('atom')) return <GiAtom className={`text-[#61DAFB] ${className}`} />;
  if (t.includes('flask') || t.includes('chem')) return <SiFlask className={`text-[#000000] dark:text-white ${className}`} />;
  return <HiOutlineDocumentText className={`text-primary-400 ${className}`} />;
};

export default function QuizzesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('Most Recent');
  const [joinCode, setJoinCode] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Data Fetching
  const { data: myQuizzes = [], isLoading: loadingMy } = useQuery({
    queryKey: ['myQuizzes'],
    queryFn: () => api.get('/quiz').then((r) => r.data.data),
  });

  const { data: publicQuizzes = [], isLoading: loadingPublic } = useQuery({
    queryKey: ['publicQuizzes', search],
    queryFn: () => api.get('/public/quizzes', { params: { search: search || undefined } }).then((r) => r.data.data),
  });

  // Mutations
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/quiz/${id}`),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] }); 
      toast.success('Quiz deleted'); 
    },
  });

  const publishMut = useMutation({
    mutationFn: (id) => api.post(`/quiz/${id}/publish`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
      toast.success(res.data.message);
    },
  });

  const hostLiveMut = useMutation({
    mutationFn: (id) => api.post(`/quiz/${id}/live`),
    onSuccess: (res) => {
      navigate(`/quiz/live/host/${res.data.data.joinCode}`);
    },
  });

  const handleJoinLive = (e) => {
    e.preventDefault();
    if (joinCode.length === 6) {
      navigate(`/quiz/live/join/${joinCode}`);
    } else {
      toast.error('Enter a valid 6-digit code');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-10 text-[#E2E8F0]">
      
      {/* Header & Top Action Cards */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Quizzes</h1>
          <p className="text-[#94A3B8] font-medium">Create, manage, and explore quizzes.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          {/* Join Card */}
          <div className="flex-1 lg:w-[380px] bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1C23] border border-[#2A2D35] flex items-center justify-center shrink-0">
              <HiOutlineUsers className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-bold text-white">Join a Live Quiz</h3>
                <p className="text-[11px] text-[#64748B] mt-1">Enter the code provided by your host to join a live quiz.</p>
              </div>
              <form onSubmit={handleJoinLive} className="flex gap-2">
                <input 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter quiz code"
                  maxLength={6}
                  className="flex-1 bg-[#0B0C10] border border-[#1E222A] rounded-xl px-3 py-2 text-xs text-white placeholder-[#475569] outline-none focus:border-[#8B5CF6]/50"
                />
                <button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  Join Quiz <HiOutlinePlay className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Create Card */}
          <div className="flex-1 lg:w-[320px] bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1C23] border border-[#2A2D35] flex items-center justify-center shrink-0">
              <HiOutlinePlus className="w-6 h-6 text-[#10B981] bg-[#10B981]/10 rounded-lg p-1" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-bold text-white">Create a New Quiz</h3>
                <p className="text-[11px] text-[#64748B] mt-1">Build your own quiz and share it with others.</p>
              </div>
              <Link to="/documents" className="block text-center border border-[#10B981]/30 hover:bg-[#10B981]/5 text-[#10B981] py-2 rounded-xl text-xs font-bold transition-all">
                Create Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* All Quizzes Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">All Quizzes</h2>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#475569]" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="w-full bg-[#111318] border border-[#1E222A] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-[#475569] outline-none focus:border-[#3B82F6]/50 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-48">
              <button className="w-full flex items-center justify-between bg-[#111318] border border-[#1E222A] rounded-xl px-4 py-3 text-sm text-[#94A3B8] font-medium">
                {category} <HiOutlineChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group w-full md:w-48">
              <button className="w-full flex items-center justify-between bg-[#111318] border border-[#1E222A] rounded-xl px-4 py-3 text-sm text-[#94A3B8] font-medium">
                {sort} <HiOutlineChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button className="text-sm font-bold text-[#3B82F6] whitespace-nowrap px-2">View all</button>
          </div>
        </div>

        {/* Public Quiz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingPublic ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-[#111318] animate-pulse rounded-2xl" />)
          ) : publicQuizzes.slice(0, 4).map((quiz) => (
            <motion.div 
              key={quiz._id}
              whileHover={{ y: -4 }}
              className="bg-[#111318] border border-[#1E222A] rounded-[2rem] p-6 flex flex-col gap-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                  <SubjectIcon topic={quiz.topic || quiz.title} className="w-7 h-7" />
                </div>
                <button className="text-[#475569] hover:text-white transition-colors">
                  <HiOutlineEllipsisVertical className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">{quiz.title}</h3>
                <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                  {quiz.description || `Test your knowledge of ${quiz.topic || 'the subject'} with these fundamental concepts.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#1E222A] border border-[#2A2D35] text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                  {quiz.topic?.split(' ')[0] || 'General'}
                </span>
              </div>

              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <HiOutlineListBullet className="w-4 h-4" />
                  <span className="text-xs font-bold">{quiz.questions?.length || 0} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <HiOutlineUsers className="w-4 h-4" />
                  <span className="text-xs font-bold">{quiz.attempts || 0}</span>
                </div>
              </div>

              <Link 
                to={`/quiz/${quiz._id}/attempt`}
                className="mt-4 w-full py-3 rounded-xl border border-primary-500/30 bg-primary-500/5 hover:bg-primary-500/10 text-primary-400 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                View Quiz
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* My Quizzes Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Quizzes</h2>
          <button className="text-sm font-bold text-[#3B82F6]">View all</button>
        </div>

        <div className="bg-[#111318] border border-[#1E222A] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1E222A] text-[10px] font-black text-[#475569] uppercase tracking-widest">
                  <th className="px-6 py-5">Quiz Title</th>
                  <th className="px-6 py-5">Questions</th>
                  <th className="px-6 py-5">Updated</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E222A]">
                {loadingMy ? (
                  Array(2).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="h-16 bg-white/5"></td>
                    </tr>
                  ))
                ) : myQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[#64748B] text-sm">No quizzes found.</td>
                  </tr>
                ) : myQuizzes.map((quiz) => (
                  <tr key={quiz._id} className="hover:bg-[#15181E] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center">
                          <SubjectIcon topic={quiz.topic || quiz.title} className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{quiz.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${quiz.isPublic ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {quiz.isPublic ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#94A3B8]">
                      {quiz.questions?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#94A3B8]">
                      {new Date(quiz.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/quiz/${quiz._id}/attempt`} className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
                          <HiOutlineEye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button onClick={() => hostLiveMut.mutate(quiz._id)} className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
                          <HiOutlineChartBar className="w-4 h-4" />
                        </button>
                        <div className="relative group/menu">
                          <button className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
                            <HiOutlineEllipsisVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-32 bg-[#1E222A] border border-[#2A303C] rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 py-1 overflow-hidden">
                            <button 
                              onClick={() => deleteMut.mutate(quiz._id)}
                              className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <HiOutlineTrash className="w-4 h-4" /> Delete
                            </button>
                            <button 
                              onClick={() => publishMut.mutate(quiz._id)}
                              className="w-full text-left px-4 py-2 text-xs text-[#3B82F6] hover:bg-[#3B82F6]/10 flex items-center gap-2"
                            >
                              <HiOutlinePlus className="w-4 h-4" /> {quiz.isPublic ? 'Unpublish' : 'Publish'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
