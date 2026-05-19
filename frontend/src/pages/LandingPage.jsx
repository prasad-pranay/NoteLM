import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HiOutlineSparkles, 
  HiOutlineDocumentText, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineRectangleStack,
  HiOutlineQueueList
} from 'react-icons/hi2';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } },
};

const STAGGER_CHILDREN = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E2E8F0] selection:bg-primary-500/30 selection:text-white font-sans overflow-hidden">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#080808]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <span className="font-bold text-white leading-none tracking-tighter">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NoteLM</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            {/* <a href="#pricing" className="hover:text-white transition-colors">Pricing</a> */}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-white hover:text-primary-400 transition-colors hidden sm:block">Sign In</Link>
            <Link to="/login" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            variants={STAGGER_CHILDREN}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
              <HiOutlineSparkles className="text-primary-400 w-4 h-4" />
              <span className="text-xs font-semibold tracking-widest uppercase text-white/80">NoteLM is live</span>
            </motion.div>
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1] mb-8">
              Transform documents into <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">interactive knowledge.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-lg md:text-xl text-[#94A3B8] max-w-2xl font-medium leading-relaxed mb-12">
              Upload your study materials, research papers, or textbooks. Our AI instantly indexes them, generates quizzes, and acts as your personal tutor.
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/login" className="w-full sm:w-auto text-base font-bold bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2 group">
                Start Learning Free
                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto text-base font-semibold text-white px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center backdrop-blur-sm">
                See how it works
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Abstract UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", damping: 20 }}
          className="max-w-5xl mx-auto mt-20 relative z-10"
        >
          <div className="relative rounded-[2rem] border border-white/10 bg-[#111318]/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video">
             {/* Mockup Header */}
             <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/80" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
               <div className="w-3 h-3 rounded-full bg-green-500/80" />
             </div>
             {/* Mockup Body */}
             <div className="p-8 grid grid-cols-3 gap-8 h-full opacity-60">
               <div className="col-span-1 border-r border-white/5 pr-8 space-y-4">
                 <div className="w-full h-8 rounded-lg bg-white/5" />
                 <div className="w-3/4 h-8 rounded-lg bg-white/5" />
                 <div className="w-full h-8 rounded-lg bg-primary-500/20" />
                 <div className="w-5/6 h-8 rounded-lg bg-white/5" />
               </div>
               <div className="col-span-2 space-y-6">
                 <div className="w-1/3 h-10 rounded-lg bg-white/10" />
                 <div className="space-y-3">
                   <div className="w-full h-4 rounded bg-white/5" />
                   <div className="w-full h-4 rounded bg-white/5" />
                   <div className="w-4/5 h-4 rounded bg-white/5" />
                 </div>
                 <div className="p-6 rounded-2xl bg-primary-500/10 border border-primary-500/20 mt-8">
                   <div className="w-1/4 h-6 rounded bg-primary-500/30 mb-4" />
                   <div className="w-full h-4 rounded bg-primary-500/20" />
                 </div>
               </div>
             </div>
             
             {/* Gradient Overlay for bottom fade */}
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">A complete learning ecosystem.</h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl">Everything you need to digest complex information quickly, built right in.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Feature 1: Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="md:col-span-2 rounded-[2rem] bg-[#111318] border border-[#1E222A] p-8 flex flex-col justify-between overflow-hidden relative group hover:border-[#2A303C] transition-colors"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Contextual AI Chat</h3>
                <p className="text-[#94A3B8] max-w-md">Ask questions directly against your uploaded documents. Our AI provides precise, cited answers instantly.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-96 h-64 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </motion.div>

            {/* Feature 2: Small */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] bg-[#111318] border border-[#1E222A] p-8 flex flex-col justify-between relative group hover:border-[#2A303C] transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <HiOutlineDocumentText className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Universal Uploads</h3>
                <p className="text-[#94A3B8] text-sm">PDF, DOCX, PPTX, or plain text. We parse and chunk it all automatically.</p>
              </div>
            </motion.div>

            {/* Feature 3: Small */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-[2rem] bg-[#111318] border border-[#1E222A] p-8 flex flex-col justify-between relative group hover:border-[#2A303C] transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <HiOutlineAcademicCap className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Auto-Quizzes</h3>
                <p className="text-[#94A3B8] text-sm">Generate practice tests instantly from your material to assess your knowledge.</p>
              </div>
            </motion.div>

            {/* Feature 4: Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 rounded-[2rem] bg-[#111318] border border-[#1E222A] p-8 flex flex-col justify-between overflow-hidden relative group hover:border-[#2A303C] transition-colors"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                  <HiOutlineRectangleStack className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Active Recall System</h3>
                <p className="text-[#94A3B8] max-w-md">Transform documents into smart flashcards. Leverage spaced repetition to ensure long-term retention.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-96 h-64 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 border-y border-white/5 bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Upload. Ask. Master.</h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">From raw document to confident knowledge in three simple steps.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connecting Line (Desktop) */}
             <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

             {[
               { num: "01", title: "Upload", desc: "Drag and drop your study materials securely into your encrypted workspace.", icon: HiOutlineArrowRight },
               { num: "02", title: "Process", desc: "Our neural engine indexes the text, extracting key concepts and summaries instantly.", icon: HiOutlineCheckBadge },
               { num: "03", title: "Learn", desc: "Chat with your data, take generated quizzes, and track your mastery over time.", icon: HiOutlineAcademicCap }
             ].map((step, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-50px" }}
                 transition={{ delay: idx * 0.2 }}
                 className="relative z-10 flex flex-col items-center text-center space-y-6"
               >
                 <div className="w-16 h-16 rounded-full bg-[#111318] border-2 border-[#1E222A] flex items-center justify-center text-xl font-bold text-white shadow-xl">
                   {step.num}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                   <p className="text-[#94A3B8] leading-relaxed">{step.desc}</p>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">Ready to learn faster?</h2>
          <p className="text-[#94A3B8] text-lg md:text-xl mb-10">Join thousands of students and professionals who are upgrading their brain with NoteLM.</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-white text-black font-bold text-lg px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]">
            Create Free Account
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-white/10 flex items-center justify-center">
              <span className="font-bold text-white text-[10px] leading-none">N</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">NoteLM</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#64748B]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-[#64748B]">© 2026 NoteLM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
