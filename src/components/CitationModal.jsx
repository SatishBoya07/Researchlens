import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

export default function CitationModal({ paper, onClose }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  const getAPA = () => {
    return `${paper.authors}. (${paper.year}). ${paper.title}. ${paper.venue || 'ArXiv Preprint'}.`;
  };

  const getIEEE = () => {
    return `${paper.authors}, "${paper.title}," ${paper.venue || 'ArXiv Preprint'}, ${paper.year}.`;
  };

  const getBibTeX = () => {
    const pId = paper.authors.split(' ')[0].replace(/[^a-zA-Z]/g, '') + paper.year;
    return `@article{${pId},
  title={${paper.title}},
  author={${paper.authors}},
  journal={${paper.venue || 'ArXiv Preprint'}},
  year={${paper.year}}
}`;
  };

  const copyToClipboard = (text, format) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const citations = [
    { format: 'APA', text: getAPA() },
    { format: 'IEEE', text: getIEEE() },
    { format: 'BibTeX', text: getBibTeX(), isCode: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy-900 border border-navy-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative">
        
        <div className="flex justify-between items-center p-6 border-b border-navy-800 bg-navy-950">
          <h2 className="text-xl font-bold font-serif-title">Cite this Paper</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {citations.map(({ format, text, isCode }) => (
            <div key={format} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-accent-cyan uppercase tracking-wider">{format}</span>
                <button
                  onClick={() => copyToClipboard(text, format)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {copiedFormat === format ? (
                    <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy</>
                  )}
                </button>
              </div>
              <div className={`p-4 rounded-xl border border-navy-700 bg-navy-950/50 text-sm overflow-x-auto ${isCode ? 'font-mono-tag whitespace-pre text-slate-300' : 'text-slate-200'}`}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
