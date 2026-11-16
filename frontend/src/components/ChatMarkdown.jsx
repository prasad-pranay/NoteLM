
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { visit } from 'unist-util-visit';
import { FileText, ExternalLink } from 'lucide-react';

function SourceChip({ name, onClick }) {
  const extension = name.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <span className="relative inline-flex group align-middle mx-1">
      <button
        type="button"
        onClick={onClick}
        className="
          inline-flex items-center gap-1.5
          rounded-md px-2 py-0.5
          text-xs font-medium
          text-blue-600 dark:text-blue-400
          bg-blue-50 dark:bg-blue-400/10
          border border-blue-200/70 dark:border-blue-400/20
          hover:bg-blue-100 dark:hover:bg-blue-400/20
          transition-colors cursor-pointer
        "
      >
        <FileText size={12} />
        {name}
        <ExternalLink size={10} />
      </button>

      {/* Source information popup */}
      <span
        className="
          absolute bottom-full left-0 mb-2 z-50
          hidden group-hover:flex
          flex-col gap-1
          min-w-52 max-w-64
          rounded-xl p-3
          bg-white dark:bg-[#202020]
          border border-gray-200 dark:border-white/10
          shadow-xl pointer-events-none
        "
      >
        <span className="flex items-center gap-2">
          <FileText size={16} className="text-blue-500" />
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            Source document
          </span>
        </span>

        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all">
          {name}
        </span>

        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {extension} DOCUMENT
        </span>
      </span>
    </span>
  );
}

// Convert source markers into custom AST nodes
function remarkSources() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const regex = /\[Source:\s*(.*?)\]/g;
      const matches = [...node.value.matchAll(regex)];

      if (!matches.length) return;

      const nodes = [];
      let lastIndex = 0;

      matches.forEach((match) => {
        const start = match.index;
        const end = start + match[0].length;

        // Preserve text before source
        if (start > lastIndex) {
          nodes.push({
            type: 'text',
            value: node.value.slice(lastIndex, start),
          });
        }

        // Insert custom source node
        nodes.push({
          type: 'source',
          data: {
            hName: 'sourcechip',
            hProperties: {
              name: match[1].trim(),
            },
          },
        });

        lastIndex = end;
      });

      // Preserve remaining text
      if (lastIndex < node.value.length) {
        nodes.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        });
      }

      parent.children.splice(index, 1, ...nodes);

      return index + nodes.length;
    });
  };
}

export default function ChatMarkdown({
  content,
  onSourceClick,
}) {
  return (
    <div className="chat-markdown min-w-0 text-[14px] leading-7 text-gray-800 dark:text-gray-200">

      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkSources]}
        rehypePlugins={[rehypeKatex]}
        components={{
          sourcechip: ({ node }) => (
            <SourceChip
              name={node.properties.name}
              onClick={() => onSourceClick?.(node.properties.name)}
            />
          ),

          p: ({ children }) => (
            <p className="mb-4 last:mb-0">{children}</p>
          ),

          h1: ({ children }) => (
            <h1 className="text-xl font-semibold mb-3 mt-5">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-3 mt-5">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2 mt-4">
              {children}
            </h3>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">{children}</li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-gray-950 dark:text-white">
              {children}
            </strong>
          ),

          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');

            return (
              <code
                className={
                  isBlock
                    ? 'block rounded-lg bg-gray-100 dark:bg-white/5 p-3 overflow-x-auto'
                    : 'rounded px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 text-sm'
                }
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

    </div>
  );
}
