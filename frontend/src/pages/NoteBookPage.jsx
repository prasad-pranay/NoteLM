import React, { useEffect } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import NoteChat from '../notebook/NoteChat'
import NoteContentShow from '../notebook/NoteContentShow'
import NoteLeftUpload from '../notebook/NoteLeftUpload'
import { useNotebookStore } from '../store/notebookStore'
import { motion } from 'framer-motion'

const NoteBookPage = () => {
  const { fetchOrCreateDefaultNotebook, isLoading, notebook } = useNotebookStore();

  useEffect(() => {
    fetchOrCreateDefaultNotebook();
  }, []);

  if (isLoading && !notebook) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Initializing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        {/* Left Panel: Uploads & Sources */}
        <Panel defaultSize={30} minSize={10} className="h-full">
          <NoteLeftUpload />
        </Panel>

        <PanelResizeHandle className="w-1.5 group relative flex items-center justify-center hover:bg-primary-500/10 transition-colors">
           <div className="w-[1px] h-full bg-[var(--border-main)] group-hover:bg-primary-500/50 group-active:bg-primary-500 transition-colors" />
           <div className="absolute w-1 h-6 rounded-full bg-[var(--border-main)] group-hover:bg-primary-500/50 group-active:bg-primary-500 transition-colors" />
        </PanelResizeHandle>

        {/* Middle Panel: Content Viewer */}
        <Panel defaultSize={36} minSize={10} className="h-full">
          <NoteContentShow />
        </Panel>

        <PanelResizeHandle className="w-1.5 group relative flex items-center justify-center hover:bg-primary-500/10 transition-colors">
           <div className="w-[1px] h-full bg-[var(--border-main)] group-hover:bg-primary-500/50 group-active:bg-primary-500 transition-colors" />
           <div className="absolute w-1 h-6 rounded-full bg-[var(--border-main)] group-hover:bg-primary-500/50 group-active:bg-primary-500 transition-colors" />
        </PanelResizeHandle>

        {/* Right Panel: AI Chat */}
        <Panel defaultSize={34} minSize={10} className="h-full">
          <NoteChat />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default NoteBookPage
