import React, { useState, useRef, useEffect } from 'react'
import { useNotebookStore } from '../store/notebookStore'
import {
  HiPaperAirplane,
  HiSparkles,
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

const NoteChat = () => {
  const { chatHistory, sendMessage, isLoading, clearChat, sources, setActiveSource } = useNotebookStore()
  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)

  const handleSourceClick = (sourceId) => {
    const source = sources.find(s => s._id === sourceId)
    if (source) {
      setActiveSource(source)
    }
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const msg = input
    setInput('')
    await sendMessage(msg)
  }

  return (
    <aside className="h-full flex flex-col bg-[var(--bg-card)] border-l border-[var(--border-main)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-main)] flex items-center justify-between bg-[var(--bg-navbar)] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary-500/10 text-primary-500">
            <HiOutlineChatBubbleLeftRight size={18} />
          </div>
          <span className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Chat</span>
        </div>
        <button
          onClick={clearChat}
          className="p-2 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 rounded-xl transition-all"
          title="Clear Chat"
        >
          <HiOutlineTrash size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
            <div className="w-16 h-16 rounded-[2rem] bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20">
              <HiSparkles className="text-primary-500" size={28} />
            </div>
            <h3 className="text-[var(--text-main)] font-black text-sm uppercase tracking-widest mb-3">Notebook Intelligence</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[200px]">
              Ask me anything about your current notebook. I'll search through your notes, files, and transcripts.
            </p>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
                          w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg
                          ${msg.role === 'user' ? 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)]' : 'bg-primary-600 text-white shadow-primary-500/20'}
                        `}>
              {msg.role === 'user' ? <HiOutlineUser size={16} /> : <HiSparkles size={16} />}
            </div>
            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`
                              px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                              ${msg.role === 'user'
                  ? 'bg-primary-600/10 text-[var(--text-main)] border border-primary-500/20 rounded-tr-none'
                  : 'bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-tl-none'}
                            `}>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>

              {/* Source Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.sources.map((source, si) => (
                    <button
                      key={si}
                      onClick={() => handleSourceClick(source.sourceId)}
                      className="group flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg text-[10px] font-bold text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all active:scale-95"
                      title={source.title}
                    >
                      <HiOutlineBookOpen className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span className="truncate max-w-[100px]">{source.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center animate-pulse shadow-lg shadow-primary-500/20">
              <HiSparkles className="text-white" size={16} />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl rounded-tl-none">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0a0a0c] border-t border-[var(--border-main)] backdrop-blur-md">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your notebook..."
            className="
                    w-full bg-[#121214] border border-[var(--border-main)] rounded-2xl py-4 pl-5 pr-14 text-sm
                    text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none
                    focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all
                    group-hover:border-[var(--text-muted)]/30
                  "
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="
                    absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl
                    bg-primary-600 flex items-center justify-center text-white
                    hover:bg-primary-500 disabled:opacity-20 disabled:grayscale transition-all
                    active:scale-90 shadow-lg shadow-primary-600/20
                  "
          >
            <HiPaperAirplane className="w-5 h-5 -rotate-45 -translate-y-0.5 translate-x-0.5" />
          </button>
        </form>
      </div>
    </aside>
  )
}

export default NoteChat

