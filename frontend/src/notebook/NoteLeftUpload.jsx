import React, { useState } from 'react'
import {
  HiDocumentText,
  HiLink,
  HiPlus,
  HiTrash,
  HiVideoCamera,
  HiCloudArrowUp,
  HiCommandLine
} from 'react-icons/hi2'
import { useNotebookStore } from '../store/notebookStore'
import { motion, AnimatePresence } from 'framer-motion'

const NoteLeftUpload = () => {
  const { sources, activeSource, setActiveSource, addSource, addLinkSource, addTextSource, deleteSource, isLoading } = useNotebookStore()
  const [activeTab, setActiveTab] = useState(0)
  const [url, setUrl] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [textContent, setTextContent] = useState('')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'file')
    await addSource(formData)
  }

  const handleAddLink = async (type) => {
    if (!url) return
    await addLinkSource(type, url)
    setUrl('')
  }

  const handleAddText = async () => {
    if (!textTitle || !textContent) return
    await addTextSource(textTitle, textContent)
    setTextTitle('')
    setTextContent('')
  }

  const tabs = [
    { id: 0, label: 'Text', icon: HiCommandLine },
    { id: 1, label: 'File', icon: HiCloudArrowUp },
    { id: 2, label: 'Web', icon: HiLink },
    { id: 3, label: 'YouTube', icon: HiVideoCamera },
  ]

  return (
    <aside className="h-full flex flex-col border-r border-[var(--border-main)]">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Sources</h2>
          <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 text-[10px] font-bold">
            {sources.length} Total
          </span>
        </div>

        {/* Modern Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                          flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all gap-1
                          ${activeTab === tab.id
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5"}
                        `}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="text-tab"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <input
                  type="text"
                  value={textTitle}
                  onChange={e => setTextTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 transition-all"
                />
                <textarea
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  placeholder="Enter content here..."
                  className="w-full resize-none bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 h-28 transition-all"
                ></textarea>
                <button
                  onClick={handleAddText}
                  disabled={isLoading || !textTitle || !textContent}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <HiPlus /> Add Note
                </button>
              </motion.div>
            )}
            {activeTab === 1 && (
              <motion.label
                key="file-tab"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer border-[var(--border-main)] bg-[var(--bg-card)] hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group"
              >
                <input type="file" className="hidden" onChange={handleFileUpload} />
                <div className="p-3 rounded-full bg-primary-500/10 text-primary-500 mb-3 group-hover:scale-110 transition-transform">
                  <HiCloudArrowUp size={24} />
                </div>
                <p className="text-xs font-bold text-[var(--text-main)]">Drop files or click to upload</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">PDF, DOCX, TXT supported</p>
              </motion.label>
            )}
            {(activeTab === 2 || activeTab === 3) && (
              <motion.div
                key="link-tab"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder={activeTab === 2 ? 'Paste URL here...' : 'Paste YouTube URL here...'}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 transition-all"
                />
                <button
                  onClick={() => handleAddLink(activeTab === 2 ? 'url' : 'youtube')}
                  disabled={isLoading || !url}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <HiPlus /> Add {activeTab === 2 ? 'Resource' : 'Video'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {sources.map((source) => (
            <motion.div
              key={source._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setActiveSource(source)}
              className={`
                              group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border
                              ${activeSource?._id === source._id
                  ? "bg-primary-500/10 border-primary-500/30 ring-1 ring-primary-500/30"
                  : "bg-[var(--bg-card)] border-[var(--border-main)] hover:border-primary-500/50"}
                            `}
            >
              <div className={`
                              p-2 rounded-xl transition-colors
                              ${activeSource?._id === source._id ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "bg-[var(--bg-main)] text-[var(--text-muted)]"}
                            `}>
                {source.type === 'file' && <HiCloudArrowUp size={18} />}
                {source.type === 'url' && <HiLink size={18} />}
                {source.type === 'youtube' && <HiVideoCamera size={18} />}
                {source.type === 'text' && <HiCommandLine size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-bold truncate transition-colors ${activeSource?._id === source._id ? "text-primary-500" : "text-[var(--text-main)]"}`}>
                  {source.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--text-muted)] opacity-60">
                    {source.type}
                  </span>
                  {source.status === 'processing' && <span className="text-[9px] text-primary-500 font-bold animate-pulse">Processing...</span>}
                  {source.status === 'failed' && <span className="text-[9px] text-red-500 font-bold">Failed</span>}
                  {source.status === 'completed' && <span className="text-[9px] text-emerald-500 font-bold">Analyzed</span>}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSource(source._id); }}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-[var(--text-muted)]"
              >
                <HiTrash size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {sources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#12141c] border border-[var(--border-main)] flex items-center justify-center mb-4 text-[var(--text-muted)] opacity-20">
              <HiCloudArrowUp size={24} />
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)]">No sources yet</p>
            <p className="text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add a note, file, or link to get started.</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default NoteLeftUpload
