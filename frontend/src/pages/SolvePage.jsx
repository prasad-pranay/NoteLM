import React from 'react';
import SolveInput from '../solve/SolveInput';
import SolvePreview from '../solve/SolvePreview';
import SolveConfig from '../solve/SolveConfig';

export default function SolvePage() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* Left Column: Editor/Input */}
      <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 border-r border-[var(--border-main)] flex flex-col h-full bg-[var(--bg-card)] shadow-xl z-10">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <SolveInput />
          <SolveConfig />
        </div>
      </div>

      {/* Right Column: Preview/Results */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-main)]">
        <SolvePreview />
      </div>
    </div>
  );
}
