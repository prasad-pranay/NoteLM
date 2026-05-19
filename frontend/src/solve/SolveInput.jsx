import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  HiOutlineCloudArrowUp, 
  HiOutlineDocumentText, 
  HiOutlineXMark,
  HiOutlinePlay
} from 'react-icons/hi2';
import { useSolveStore } from '../store/solveStore';

export default function SolveInput() {
  const [manualText, setManualText] = useState('');
  const [file, setFile] = useState(null);
  const { processQuestions, isProcessing } = useSolveStore();

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const handleSubmit = () => {
    if (!file && !manualText.trim()) return;
    processQuestions(file, manualText);
  };

  return (
    <div className="flex flex-col border-b border-[var(--border-main)]">
      <div className="p-5 space-y-6">
        
        {/* Header */}
        <div>
            <h2 className="text-sm font-bold text-[var(--text-main)]">Problem Source</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Upload a document or paste text to solve.</p>
        </div>

        {/* File Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-muted)]">File Upload</label>
          <div 
            {...getRootProps()} 
            className={`
              relative border border-dashed rounded-md p-4 transition-all cursor-pointer
              flex items-center gap-3
              ${isDragActive 
                ? 'border-primary-500 bg-primary-500/10' 
                : 'border-[var(--border-main)] hover:border-primary-500/50 bg-[var(--bg-main)]'}
            `}
          >
            <input {...getInputProps()} />
            <div className={`p-2 rounded bg-[var(--bg-card)] border border-[var(--border-main)] ${file ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
              {file ? <HiOutlineDocumentText size={20} /> : <HiOutlineCloudArrowUp size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-main)] truncate">
                {file ? file.name : 'Click or drag file here'}
              </p>
              {!file && <p className="text-xs text-[var(--text-muted)] mt-0.5">PDF, DOCX, TXT, IMG</p>}
            </div>
            {file && (
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all"
              >
                <HiOutlineXMark size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Manual Input Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-muted)]">Manual Input</label>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type or paste questions here..."
            className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-md p-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 min-h-[200px] resize-y transition-all font-mono"
          />
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={handleSubmit}
          disabled={isProcessing || (!file && !manualText.trim())}
          className="
            w-full py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:bg-[var(--border-main)] disabled:text-[var(--text-muted)]
            text-white text-sm font-semibold rounded-md transition-all 
            flex items-center justify-center gap-2 active:scale-[0.98]
          "
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <HiOutlinePlay size={16} />
              <span>Run Solver</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
