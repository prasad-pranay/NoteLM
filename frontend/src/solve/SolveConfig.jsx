import React from 'react';
import { useSolveStore } from '../store/solveStore';

export default function SolveConfig() {
  const { config, setConfig } = useSolveStore();

  const options = [
    { 
      label: 'Detail', 
      key: 'detailLevel', 
      values: ['short', 'medium', 'detailed'] 
    },
    { 
      label: 'Format', 
      key: 'style', 
      values: ['bullet', 'paragraph', 'step-by-step'] 
    },
    { 
      label: 'Difficulty', 
      key: 'difficulty', 
      values: ['beginner', 'exam', 'advanced'] 
    }
  ];

  return (
    <div className="p-5 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[var(--text-main)]">Configuration</h2>
      </div>

      <div className="space-y-4">
        {options.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between gap-4">
            <label className="text-xs font-semibold text-[var(--text-muted)] w-16 shrink-0">{opt.label}</label>
            <div className="flex-1 flex bg-[var(--bg-main)] rounded border border-[var(--border-main)] p-0.5">
              {opt.values.map((val) => (
                <button
                  key={val}
                  onClick={() => setConfig({ [opt.key]: val })}
                  className={`
                    flex-1 py-1 text-[10px] font-semibold rounded-sm transition-all
                    ${config[opt.key] === val 
                      ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm border border-[var(--border-main)]' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'}
                  `}
                >
                  {val.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between gap-4">
          <label className="text-xs font-semibold text-[var(--text-muted)] w-16 shrink-0">Language</label>
          <select 
            value={config.language}
            onChange={(e) => setConfig({ language: e.target.value })}
            className="flex-1 bg-[var(--bg-main)] border border-[var(--border-main)] rounded py-1 px-2 text-xs text-[var(--text-main)] outline-none focus:border-primary-500/50 cursor-pointer"
          >
            {['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese', 'Japanese'].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
