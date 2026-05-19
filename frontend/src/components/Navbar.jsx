import { useAuthStore } from '../store/authStore.js';
import { useThemeStore } from '../store/themeStore.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlinePlus,
  HiOutlineCommandLine
} from 'react-icons/hi2';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="
      h-16 flex-shrink-0 flex items-center justify-between px-6
      bg-[var(--bg-navbar)] backdrop-blur-xl 
      sticky top-0 z-40 transition-colors duration-300
    ">
      {/* Left Section — Search & Quick Actions */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="relative group w-full hidden md:block">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search documents, quizzes..."
            className="
              w-full pl-11 pr-4 py-2 rounded-xl text-sm
              bg-[var(--bg-card)] border border-[var(--border-main)]
              text-[var(--text-main)] placeholder-[var(--text-muted)]
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50
              transition-all duration-200
            "
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-md bg-white/5 border border-white/5">
            <HiOutlineCommandLine className="w-3 h-3 text-[var(--text-muted)]" />
            <span className="text-[10px] font-bold text-[var(--text-muted)]">K</span>
          </div>
        </div>
      </div>

      {/* Right Section — Tools, Theme, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/documents')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5842EA] text-white text-sm font-bold hover:bg-primary-500 transition-all hover:scale-[1.02] active:scale-95"
        >
          <HiOutlinePlus className="w-4 h-4" />
          <span>Upload</span>
        </button>

        <div className="w-px h-6 bg-[var(--border-main)] mx-2 hidden sm:block" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="
            w-10 h-10 flex items-center justify-center rounded-xl
            text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-500/10
            transition-all duration-200 relative overflow-hidden
          "
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div key="moon" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                <HiOutlineMoon className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                <HiOutlineSun className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="
          w-10 h-10 flex items-center justify-center rounded-xl
          text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-500/10
          transition-all duration-200 relative
        ">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-[var(--bg-navbar)]"></span>
        </button>
        <div className="border-l border-[var(--border-main)] h-6.5"></div>

        {/* Profile Dropdown */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 ml-2 px-3 transition duration-200 group cursor-pointer hover:bg-white/10 py-2 rounded"
        >
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-[var(--text-main)] leading-none">{user?.name}</p>
            <p className="text-[10px] font-medium text-[var(--text-muted)] mt-1">{user?.role === 'admin' ? 'Premium Member' : 'Study Plan'}</p>
          </div>
          <div className="relative">
            {user?.avatar ? (
              <img src={`http://localhost:5000${user.avatar}`} alt="" className='w-8 h-8 rounded-full object-cover border border-[var(--border-main)]' />
            ) : (
              <img src="/student.png" alt="" className='w-8 h-8 rounded-full object-cover border border-[var(--border-main)]' />
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-navbar)]"></div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="
            ml-1 w-10 h-10 flex items-center justify-center rounded-xl
            text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10
            transition-all duration-200 active:scale-90
          "
        >
          <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
// import { useAuthStore } from '../store/authStore.js';
// import { useNavigate } from 'react-router-dom';
// import { HiOutlineArrowRightOnRectangle, HiOutlineUser } from 'react-icons/hi2';

// export default function Navbar() {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header className="h-16 border-b border-white/5 bg-surface-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
//       <div />
//       <div className="flex items-center gap-4">
//         {/* Points badge */}
//         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/20">
//           <span className="text-xs font-semibold text-primary-400">⚡ {user?.points || 0} pts</span>
//         </div>

//         {/* User info */}
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
//             <HiOutlineUser className="w-4 h-4 text-white" />
//           </div>
//           <span className="text-sm font-medium text-surface-300 hidden sm:block">{user?.name}</span>
//         </div>

//         <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/5 text-surface-400 hover:text-danger transition-colors" title="Logout">
//           <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
//         </button>
//       </div>
//     </header>
//   );
// }
