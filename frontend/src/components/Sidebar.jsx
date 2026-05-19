import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore.js';
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlinePuzzlePiece,
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBookOpen,
  HiOutlineSparkles,
} from 'react-icons/hi2';

import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FileIcon = () => (
  <svg className='size-3.5' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="#e2e5e7" d="M128 0c-17.6 0-32 14.4-32 32v448c0 17.6 14.4 32 32 32h320c17.6 0 32-14.4 32-32V128L352 0z" />
    <path fill="#b0b7bd" d="M384 128h96L352 0v96c0 17.6 14.4 32 32 32" />
    <path fill="#f15642" d="M416 416c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V256c0-8.8 7.2-16 16-16h352c8.8 0 16 256c0 8.8-7.2 16-16 16z" />
  </svg>
);

const DocumentItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then((r) => r.data.data),
  });

  return (
    <div className='flex flex-col ml-9 mt-1 space-y-1 mb-2 border-l border-[var(--border-main)]'>
      {data?.map((doc, index) => (
        <motion.div
          key={doc._id}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => navigate(`/documents/${doc._id}`)}
          className={`
            group flex items-center px-3 py-2 rounded-r-lg cursor-pointer transition-all
            ${location.pathname.includes(doc._id)
              ? 'bg-primary-500/10 text-primary-500 font-bold border-l-2 border-primary-500 -ml-[1px]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]'}
          `}
        >
          <span className="text-[11px] truncate max-w-[140px]">{doc.title}</span>
        </motion.div>
      ))}
    </div>
  );
};

const navItems = [
  { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/notebook', icon: HiOutlineBookOpen, label: 'Notebook' },
  { path: '/solve', icon: HiOutlineSparkles, label: 'Solver' },
  { path: '/documents', icon: HiOutlineDocumentText, label: 'Documents', hasChildren: true },
  { path: '/quizzes', icon: HiOutlinePuzzlePiece, label: 'Quizzes' },
  // { path: '/explore', icon: HiOutlineGlobeAlt, label: 'Explore' },
  { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [showDocuments, setShowDocuments] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-50 flex flex-col
        bg-[var(--bg-sidebar)]
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Brand Logo */}
      <div onClick={()=>navigate("/")} className={`
        flex items-center h-16 flex-shrink-0 cursor-pointer
        ${sidebarOpen ? 'px-6 gap-3' : 'justify-center'}
      `}>
        <div  className="w-10 h-10 rounded-sm bg-[#0D1018] flex items-center justify-center border border-[var(--border-main)] shrink-0">
          <img src="/icon.png" alt="NoteLM" className="w-8 h-8" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className="text-lg font-black text-[var(--text-main)] tracking-tight"
            >
              NoteLM
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label, hasChildren }) => (
          <div key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              className={({ isActive }) => `
                group relative flex active:scale-80 items-center py-3.5 rounded-2xl transition duration-200 z-10
                ${sidebarOpen ? 'px-4 gap-3' : 'justify-center'}
                ${isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveTab"
                      className="absolute inset-0 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20 -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-transparent group-hover:bg-[var(--glass-bg)] transition-colors duration-200 -z-10" />
                  )}

                  <Icon className={`relative z-10 w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${sidebarOpen ? '' : 'mx-auto'}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div className="relative z-10 flex-1 flex items-center justify-between" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0, scaleX: 0 }}>
                        <span className="text-sm font-bold tracking-tight">{label}</span>
                        {hasChildren && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setShowDocuments(!showDocuments);
                            }}
                            className={`p-1 rounded-lg hover:bg-white/10 transition-transform duration-200 ${showDocuments ? 'rotate-180' : ''}`}
                          >
                            <HiOutlineChevronLeft className="-rotate-90 w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!sidebarOpen && (
                    <div className="
                      absolute left-[120%] ml-4 px-3 py-2 bg-[var(--bg-sidebar)] border border-[var(--border-main)] 
                      text-[var(--text-main)] text-xs font-bold rounded-xl shadow-2xl opacity-0 
                      group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 
                      pointer-events-none transition-all duration-200 z-50 
                    ">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>

            {sidebarOpen && hasChildren && showDocuments && <DocumentItems />}
          </div>
        ))}
      </nav>

      {/* Footer / User Profile Summary */}
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className={`
            w-full flex items-center py-3 rounded-2xl transition-all
            border border-[var(--border-main)]
            bg-[#0F151F]
            text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]
            ${sidebarOpen ? 'px-4 gap-3' : 'justify-center'}
          `}
        >
          {sidebarOpen ? (
            <>
              <HiOutlineChevronLeft className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Collapse</span>
            </>
          ) : (
            <HiOutlineChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );


  // const navItems = [
  //   { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  //   { path: '/documents', icon: HiOutlineDocumentText, label: 'Documents' },
  //   { path: '/quizzes', icon: HiOutlinePuzzlePiece, label: 'My Quizzes' },
  //   { path: '/explore', icon: HiOutlineGlobeAlt, label: 'Explore' },
  //   { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  // ];

  // export default function Sidebar() {
  //   const { sidebarOpen, toggleSidebar } = useAppStore();

  //   return (
  //     <aside className={`fixed left-0 top-0 h-full bg-surface-900/80 backdrop-blur-xl border-r border-white/5 z-30 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}>
  //       {/* Logo */}
  //       <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
  //         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">N</div>
  //         {sidebarOpen && <span className="text-lg font-bold gradient-text">NoteLM</span>}
  //       </div>

  //       {/* Nav items */}
  //       <nav className="flex-1 py-4 space-y-1 px-2">
  //         {navItems.map(({ path, icon: Icon, label }) => (
  //           <NavLink
  //             key={path}
  //             to={path}
  //             end={path === '/'}
  //             className={({ isActive }) =>
  //               `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
  //               ${isActive ? 'bg-primary-600/20 text-primary-400' : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'}`
  //             }
  //           >
  //             <Icon className="w-5 h-5 shrink-0" />
  //             {sidebarOpen && <span>{label}</span>}
  //           </NavLink>
  //         ))}
  //       </nav>

  //       {/* Collapse button */}
  //       <button
  //         onClick={toggleSidebar}
  //         className="flex items-center justify-center h-12 border-t border-white/5 text-surface-400 hover:text-surface-200 transition-colors"
  //       >
  //         {sidebarOpen ? <HiOutlineChevronLeft className="w-5 h-5" /> : <HiOutlineChevronRight className="w-5 h-5" />}
  //       </button>
  //     </aside>
  //   );
}
