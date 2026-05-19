import React, { useMemo, useState, useEffect } from "react";
import { useNotebookStore } from '../store/notebookStore'
import { 
  HiOutlineArrowTopRightOnSquare, 
  HiXMark, 
  HiOutlineMap, 
  HiOutlineBolt, 
  HiOutlineClipboardDocumentList, 
  HiOutlineArrowPath,
  HiOutlineSparkles,
  HiOutlineDocumentText
} from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, { Background, Controls } from "reactflow";
import ReactMarkdown from 'react-markdown';
import "reactflow/dist/style.css";

const NoteContentShow = () => {
  const { activeSource, setActiveSource, generatedContent, generateMaterial, isLoading, notebook } = useNotebookStore()

  const handleAction = (type) => {
    generateMaterial(type)
  }

  if (isLoading && !activeSource) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-[#0c0c0e]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-primary-500/20"></div>
        <p className="text-sm font-bold animate-pulse tracking-wide uppercase">Generating your {generatedContent?.type || 'material'}...</p>
      </div>
    )
  }

  if (generatedContent) {
    return (
      <aside className="h-full flex flex-col bg-[var(--bg-main)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-main)] flex items-center justify-between bg-[var(--bg-navbar)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500">
              {generatedContent.type === 'mindmap' && <HiOutlineMap size={20}/>}
              {generatedContent.type === 'roadmap' && <HiOutlineArrowPath size={20}/>}
              {generatedContent.type === 'flashcards' && <HiOutlineBolt size={20}/>}
              {generatedContent.type === 'quiz' && <HiOutlineClipboardDocumentList size={20}/>}
            </div>
            <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">
              {generatedContent.type}
            </h3>
          </div>
          <button 
            onClick={() => useNotebookStore.setState({ generatedContent: null })} 
            className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
          >
            <HiXMark size={20}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {generatedContent.type === "mindmap" ? <Mindmap treeData={parseMarkdownToTree(generatedContent.response)}/> :
           generatedContent.type === "roadmap" ? <RoadmapViewer text={generatedContent.response}/> :
           generatedContent.type === "flashcards" ? <Flashcards inputData={generatedContent.response} /> :
           <div className="prose prose-invert max-w-none text-[var(--text-main)] leading-relaxed">
             <ReactMarkdown>{generatedContent.response}</ReactMarkdown>
           </div>
          }
        </div>
      </aside>
    )
  }

  if (!activeSource) {
    return (
      <aside className="h-full flex flex-col items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="w-20 h-20 rounded-[2.5rem] bg-primary-500/10 flex items-center justify-center mb-8 mx-auto border border-primary-500/20 shadow-2xl shadow-primary-500/10">
            <HiOutlineSparkles size={40} className="text-primary-500"/>
          </div>
          <h2 className="text-3xl font-black text-[var(--text-main)] mb-4 tracking-tight italic">Notebook Workspace</h2>
          <p className="text-[var(--text-muted)] mb-12 text-sm max-w-md mx-auto leading-relaxed">
            Select a source from the left to start reading, or use our AI to transform your entire notebook into interactive study materials.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { type: 'mindmap', label: 'Mindmap', icon: HiOutlineMap, color: 'blue', desc: 'Visualize structure' },
              { type: 'roadmap', label: 'Roadmap', icon: HiOutlineArrowPath, color: 'emerald', desc: 'Learning path' },
              { type: 'flashcards', label: 'Flashcards', icon: HiOutlineBolt, color: 'amber', desc: 'Quick review' },
              { type: 'quiz', label: 'Quiz', icon: HiOutlineClipboardDocumentList, color: 'purple', desc: 'Test yourself' },
            ].map((item) => (
              <button 
                key={item.type}
                onClick={() => handleAction(item.type)} 
                className="flex flex-col items-start p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group text-left shadow-sm hover:shadow-xl hover:shadow-primary-500/5 active:scale-[0.98]"
              >
                <div className={`p-3 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24}/>
                </div>
                <h3 className="text-[var(--text-main)] font-black text-sm uppercase tracking-wider mb-1">{item.label}</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">{item.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </aside>
    )
  }

  return (
    <aside className="h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-[var(--border-main)] flex items-center justify-between bg-[var(--bg-navbar)] backdrop-blur-md">
        <div className="flex items-center gap-3 overflow-hidden">
           <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500 shrink-0">
             <HiOutlineDocumentText size={20}/>
           </div>
           <h3 className="text-sm font-bold text-[var(--text-main)] truncate tracking-tight">{activeSource.title}</h3>
        </div>
        <button 
          onClick={() => setActiveSource(null)} 
          className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all active:rotate-90"
        >
          <HiXMark size={20}/>
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeSource.type === 'file' && activeSource.metadata?.fileType === 'pdf' ? (
          <iframe 
            src={`http://localhost:5000/${activeSource.metadata.filePath}`} 
            className="w-full h-full border-none"
            title={activeSource.title}
          />
        ) : activeSource.type === 'url' ? (
          <div className="h-full flex flex-col">
            <div className="p-3 bg-[var(--bg-card)] flex items-center justify-end px-6 border-b border-[var(--border-main)]">
              <a href={activeSource.metadata.url} target="_blank" rel="noreferrer" className="text-primary-500 hover:text-primary-400 text-[10px] flex items-center gap-2 uppercase tracking-widest font-black transition-colors">
                View Original <HiOutlineArrowTopRightOnSquare size={14}/>
              </a>
            </div>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               <article className="prose prose-invert max-w-3xl mx-auto">
                 <h1 className="text-4xl font-black text-[var(--text-main)] mb-10 tracking-tight leading-tight">{activeSource.title}</h1>
                 <div className="text-lg text-[var(--text-main)] opacity-80 leading-relaxed font-serif">
                   <ReactMarkdown>{activeSource.content || 'Fetching content...'}</ReactMarkdown>
                 </div>
               </article>
            </div>
          </div>
        ) : activeSource.type === 'youtube' ? (
          <div className="h-full flex flex-col">
            <div className="aspect-video w-full bg-black shadow-2xl relative z-10">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeSource.metadata.youtubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-sm font-black text-primary-500 uppercase tracking-[0.2em] mb-4 border-b border-primary-500/20 pb-2">Video Transcript</h2>
                <div className="text-[var(--text-main)] opacity-70 text-lg leading-relaxed font-serif">
                  <ReactMarkdown>{activeSource.content || 'Transcript not available for this video.'}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 overflow-y-auto h-full custom-scrollbar">
            <article className="prose prose-invert max-w-3xl mx-auto">
              <h1 className="text-4xl font-black text-[var(--text-main)] mb-10 tracking-tight leading-tight">{activeSource.title}</h1>
              <div className="text-lg text-[var(--text-main)] opacity-80 leading-relaxed font-serif">
                <ReactMarkdown>{activeSource.content}</ReactMarkdown>
              </div>
            </article>
          </div>
        )}
      </div>
    </aside>
  )
}

export default NoteContentShow;








const createFlowNodes = (tree, x = 0, y = 0, level = 0, nodes = [], edges = [], parent = null) => {
  const id = tree.id;

  nodes.push({
    id,
    data: { label: tree.label },
    position: { x: level * 250, y },
    style: {
      padding: 10,
      borderRadius: 10,
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #334155",
    },
  });

  if (parent) {
    edges.push({
      id: `${parent}-${id}`,
      source: parent,
      target: id,
      animated: true,
    });
  }

  let childY = y;

  tree.children.forEach((child) => {
    childY += 100;
    createFlowNodes(child, x, childY, level + 1, nodes, edges, id);
  });

  return { nodes, edges };
};

function Mindmap({ treeData }) {
  const { nodes, edges } = useMemo(() => {
    return createFlowNodes(treeData);
  }, [treeData]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function parseMarkdownToTree(markdown) {
  const lines = markdown.split("\n");

  const root = {
    id: "root",
    label: "Root",
    children: [],
  };

  const stack = [{ level: 0, node: root }];

  lines.forEach((line) => {
    if (!line.trim()) return;

    let level = 0;
    let text = "";

    // HEADINGS (#, ##, ###)
    if (/^#+\s/.test(line)) {
      level = line.match(/^#+/)[0].length;
      text = line.replace(/^#+\s*/, "");
    }

    // BULLETS (- with indentation)
    else if (/^\s*-\s/.test(line)) {
      const indent = line.match(/^\s*/)[0].length;
      level = Math.floor(indent / 2) + stack[stack.length - 1].level + 1;
      text = line.replace(/^\s*-\s*/, "");
    } else {
      return;
    }

    const newNode = {
      id: Math.random().toString(36).slice(2),
      label: text,
      children: [],
    };

    // 🔥 FIX: never pop root
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (!parent || !parent.node) return; // extra safety

    parent.node.children.push(newNode);

    stack.push({ level, node: newNode });
  });

  return root.children[0] || root;
}


// function RoadmapViewer({ text }) {
//   const data = parseRoadmap(text);
//   const [openPhase, setOpenPhase] = useState(null);
//   const [openStep, setOpenStep] = useState({});

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-2xl font-bold">{data.title}</h1>

//       {data.phases.map((phase, pIndex) => (
//         <div key={pIndex} className="border rounded-lg p-3">
          
//           {/* Phase Header */}
//           <button
//             onClick={() =>
//               setOpenPhase(openPhase === pIndex ? null : pIndex)
//             }
//             className="w-full text-left font-semibold text-lg"
//           >
//             {phase.title}
//           </button>

//           {/* Steps */}
//           {openPhase === pIndex && (
//             <div className="mt-3 space-y-2 pl-3 border-l">
//               {phase.steps.map((step, sIndex) => {
//                 const isOpen = openStep[`${pIndex}-${sIndex}`];

//                 return (
//                   <div key={sIndex} className="bg-white/10 p-2 rounded">
                    
//                     {/* Step Header */}
//                     <button
//                       onClick={() =>
//                         setOpenStep((prev) => ({
//                           ...prev,
//                           [`${pIndex}-${sIndex}`]:
//                             !prev[`${pIndex}-${sIndex}`],
//                         }))
//                       }
//                       className="font-medium text-left w-full"
//                     >
//                       {step.title}
//                     </button>

//                     {/* Step Content */}
//                     {isOpen && (
//                       <ul className="mt-2 list-disc pl-5 text-sm text-gray-200 space-y-1">
//                         {step.content.map((item, i) => (
//                           <li key={i}>{item}</li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }


function parseRoadmap(markdown) {
  const lines = markdown.split("\n");

  const roadmap = {
    title: "",
    phases: [],
  };

  let currentPhase = null;
  let currentStep = null;

  const clean = (str) => str.replace(/[#*`]/g, "").trim();

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Title
    if (line.startsWith("# ") && !roadmap.title) {
      roadmap.title = clean(line);
      continue;
    }

    // Phase
    if (line.startsWith("## ")) {
      currentPhase = {
        title: clean(line),
        steps: [],
      };
      roadmap.phases.push(currentPhase);
      currentStep = null;
      continue;
    }

    // Step (### Step)
    if (line.startsWith("### ")) {
      currentStep = {
        title: clean(line),
        content: [],
      };
      currentPhase?.steps.push(currentStep);
      continue;
    }

    // Bullet points / content
    if (line.startsWith("-") || line.startsWith("•")) {
      currentStep?.content.push(clean(line));
    }
  }

  return roadmap;
}





function RoadmapViewer({ text }) {
  const data = parseRoadmap(text);
  const [openPhase, setOpenPhase] = useState(null);
  const [openSteps, setOpenSteps] = useState({});
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const togglePhase = (pi) => setOpenPhase(openPhase === pi ? null : pi);
  const toggleStep = (key) =>
    setOpenSteps((prev) => ({ ...prev, [key]: !prev[key] }));

  const t = dark ? tokens.dark : tokens.light;

  return (
    <div style={{ padding: "1.5rem 1rem", maxWidth: 680, margin: "0 auto", background: t.bg, minHeight: "100vh", transition: "background 0.3s" }}>
      <style>{`
        .rm-phase-card {
          border: 0.5px solid ${t.border};
          border-radius: 12px;
          background: ${t.surface};
          margin-bottom: 10px;
          overflow: hidden;
          transition: border-color 0.2s ease, background 0.3s;
        }
        .rm-phase-card:hover { border-color: ${t.borderHover}; }
        .rm-phase-btn {
          width: 100%; background: none; border: none;
          padding: 1rem 1.25rem;
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; text-align: left;
          transition: background 0.15s ease;
        }
        .rm-phase-btn:hover { background: ${t.hover}; }
        .rm-phase-index {
          width: 24px; height: 24px; border-radius: 50%;
          background: ${t.indexBg};
          border: 0.5px solid ${t.border};
          font-size: 11px; font-weight: 500;
          color: ${t.muted};
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .rm-phase-index.active {
          background: ${dark ? "#0C447C" : "#E6F1FB"};
          border-color: ${dark ? "#378ADD" : "#85B7EB"};
          color: ${dark ? "#B5D4F4" : "#0C447C"};
        }
        .rm-chevron {
          width: 16px; height: 16px; color: ${t.muted};
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
        }
        .rm-chevron.open { transform: rotate(180deg); }
        .rm-steps-wrap { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
        .rm-steps-wrap.open { max-height: 9999px; }
        .rm-step-card {
          border: 0.5px solid ${t.border};
          border-radius: 8px;
          background: ${t.stepBg};
          overflow: hidden; margin-bottom: 6px;
          transition: border-color 0.15s ease, background 0.3s;
        }
        .rm-step-card:hover { border-color: ${t.borderHover}; }
        .rm-step-btn {
          width: 100%; background: none; border: none;
          padding: 0.65rem 0.9rem;
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; text-align: left;
          transition: background 0.15s ease;
        }
        .rm-step-btn:hover { background: ${t.stepHover}; }
        .rm-step-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${t.dot}; flex-shrink: 0;
          transition: background 0.2s;
        }
        .rm-step-dot.active { background: ${dark ? "#85B7EB" : "#378ADD"}; }
        .rm-step-chevron {
          width: 14px; height: 14px; color: ${t.muted};
          transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
        }
        .rm-step-chevron.open { transform: rotate(180deg); }
        .rm-step-content { max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1); }
        .rm-step-content.open { max-height: 9999px; }
        .rm-toggle {
          background: ${t.toggleBg};
          border: 0.5px solid ${t.border};
          border-radius: 99px;
          padding: 4px 12px;
          font-size: 12px;
          color: ${t.muted};
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .rm-toggle:hover { background: ${t.hover}; color: ${t.text}; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, letterSpacing: "-0.3px" }}>
          {data.title}
        </h1>
        <button className="rm-toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀ Light" : "☾ Dark"}
        </button>
      </div>

      {data.phases.map((phase, pi) => {
        const isPhaseOpen = openPhase === pi;
        return (
          <div key={pi} className="rm-phase-card">
            <button className="rm-phase-btn" onClick={() => togglePhase(pi)}>
              <span className={`rm-phase-index${isPhaseOpen ? " active" : ""}`}>{pi + 1}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: t.text }}>{phase.title}</span>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 99,
                background: t.badgeBg, border: `0.5px solid ${t.border}`,
                color: t.muted, flexShrink: 0
              }}>
                {phase.steps.length} steps
              </span>
              <ChevronIcon className={`rm-chevron${isPhaseOpen ? " open" : ""}`} />
            </button>

            <div className={`rm-steps-wrap${isPhaseOpen ? " open" : ""}`}>
              <div style={{ padding: "0 1.25rem 1rem" }}>
                <div style={{ height: "0.5px", background: t.border, marginBottom: "0.75rem" }} />
                {phase.steps.map((step, si) => {
                  const key = `${pi}-${si}`;
                  const isStepOpen = !!openSteps[key];
                  return (
                    <div key={si} className="rm-step-card">
                      <button className="rm-step-btn" onClick={() => toggleStep(key)}>
                        <span className={`rm-step-dot${isStepOpen ? " active" : ""}`} />
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: t.text }}>{step.title}</span>
                        <ChevronIcon className={`rm-step-chevron${isStepOpen ? " open" : ""}`} />
                      </button>
                      <div className={`rm-step-content${isStepOpen ? " open" : ""}`}>
                        <ul style={{ padding: "0 0.9rem 0.75rem 1.5rem", display: "flex", flexDirection: "column", gap: 4, listStyle: "none" }}>
                          {step.content.map((item, i) => (
                            <li key={i} style={{ fontSize: 13, color: t.muted, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ width: 4, height: 4, borderRadius: "50%", background: t.dot, flexShrink: 0, marginTop: 7 }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const tokens = {
  light: {
    bg:        "#f9f9f8",
    surface:   "#ffffff",
    stepBg:    "#f5f5f4",
    hover:     "#f0f0ef",
    stepHover: "#ffffff",
    toggleBg:  "#f0f0ef",
    badgeBg:   "#f0f0ef",
    indexBg:   "#f0f0ef",
    text:      "#1a1a18",
    muted:     "#888780",
    border:    "rgba(0,0,0,0.10)",
    borderHover:"rgba(0,0,0,0.20)",
    dot:       "#c8c7c0",
  },
  dark: {
    bg:        "#141413",
    surface:   "#1e1e1c",
    stepBg:    "#252523",
    hover:     "#2a2a28",
    stepHover: "#1e1e1c",
    toggleBg:  "#2a2a28",
    badgeBg:   "#2a2a28",
    indexBg:   "#2a2a28",
    text:      "#e8e6df",
    muted:     "#888780",
    border:    "rgba(255,255,255,0.08)",
    borderHover:"rgba(255,255,255,0.16)",
    dot:       "#555550",
  },
};

function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}





// Example usage:
// <Flashcards data={flashcardData} />

function Flashcards({ inputData }) {
    const data = JSON.parse(String(inputData).replaceAll("`","").replaceAll("json",""))
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No flashcards available
      </div>
    );
  }

  const current = data[index];

  const nextCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % data.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      {/* Progress */}
      <div className="mb-4 text-sm text-gray-500">
        {index + 1} / {data.length}
      </div>

      {/* Card */}
      <div
        className="perspective w-full max-w-xl h-72 cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full rounded-2xl shadow-xl bg-white dark:bg-gray-900 flex items-center justify-center p-6 text-center text-lg font-medium border"
            style={{ transformStyle: "preserve-3d" }}
          >
            {flipped ? current.back : current.front}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6 justify-between w-full">
        <button
          onClick={prevCard}
          className="text-sm px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 transition"
        >
          Previous
        </button>

        <button
          onClick={() => setFlipped((f) => !f)}
          className="text-sm px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Flip
        </button>

        <button
          onClick={nextCard}
          className="text-sm px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/*
Helper: If your input is a string, parse it like this before passing:

const flashcardData = JSON.parse(yourString);

<Flashcards data={flashcardData} />
*/
