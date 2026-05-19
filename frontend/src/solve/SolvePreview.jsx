import React, { useRef, useState } from 'react';
import { useSolveStore } from '../store/solveStore';
import { 
  HiOutlineArrowDownTray,
  HiOutlineCodeBracketSquare
} from 'react-icons/hi2';
import jsPDF from 'jspdf';
import ReactMarkdown from "react-markdown"

export default function SolvePreview() {
  const { questions, updateAnswer, isProcessing } = useSolveStore();
  const [editingIndex, setEditingIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;

      let y = margin;
      const lineHeight = 7;

      const element = pdfRef.current;
      const textContent = element.innerText || element.textContent;
      const lines = textContent.split("\n");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Solved Questions", margin, y);
      y += 10;

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const isQuestion = /^\d+\./.test(trimmed) || /^Q\d+/i.test(trimmed) || trimmed.endsWith("?");

        if (isQuestion) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
        }

        const wrappedLines = pdf.splitTextToSize(trimmed, maxLineWidth);

        wrappedLines.forEach((wrapLine) => {
          if (y + lineHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(wrapLine, margin, y);
          y += lineHeight;
        });

        y += 2;
      });

      pdf.save("Solutions.pdf");
    } catch (error) {
      console.error("PDF Error:", error);
    }
    setIsGenerating(false);
  };

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)]">
        <div className="w-8 h-8 border-2 border-[var(--text-muted)] border-t-[var(--text-main)] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Processing your request...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)]">
        <HiOutlineCodeBracketSquare size={32} className="opacity-50 mb-3" />
        <p className="text-sm font-medium">Output will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)]">
      {/* Header Toolbar */}
      <div className="px-6 py-3 border-b border-[var(--border-main)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
        <h3 className="text-sm font-semibold text-[var(--text-main)]">Solutions <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold">{questions.length}</span></h3>
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] border border-[var(--border-main)] text-xs font-medium rounded transition-all active:scale-95 disabled:opacity-50"
        >
          <HiOutlineArrowDownTray size={14} />
          {isGenerating ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div ref={pdfRef} className="max-w-3xl mx-auto space-y-8 pb-12">
          {questions.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-sm font-bold text-[var(--text-main)] flex items-start gap-2">
                <span className="text-[var(--text-muted)] shrink-0">Q{idx + 1}.</span>
                <span>{item.question}</span>
              </h4>
              <div className="pl-6 border-l-2 border-[var(--border-main)]">
                {editingIndex === idx ? (
                  <textarea
                    autoFocus
                    value={item.answer}
                    onChange={(e) => updateAnswer(idx, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    className="w-full bg-[var(--bg-card)] text-sm leading-relaxed p-3 rounded border border-[var(--border-main)] outline-none resize-y min-h-[100px] font-mono"
                  />
                ) : (
                  <div 
                    className="prose prose-sm prose-invert max-w-none text-[var(--text-main)] leading-relaxed font-serif cursor-text p-2 hover:bg-[var(--bg-card)] rounded transition-colors"
                    onClick={() => setEditingIndex(idx)}
                  >
                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
