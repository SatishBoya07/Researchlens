import { Link } from 'react-router-dom';
import { ChevronRight, Hash, Calendar, GraduationCap } from 'lucide-react';

export default function PaperCard({ paper, score, rank }) {
  const percentage = parseFloat(score);

  let barColor = 'bg-blue-500';
  if (percentage >= 85) barColor = 'bg-gradient-to-r from-blue-500 to-cyan-500';
  else if (percentage <= 60) barColor = 'bg-slate-400';

  return (
    <div className="relative group bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-6 transition-all duration-300 flex flex-col gap-4 w-full">

      {/* Rank & Match Bar */}
      <div className="flex items-center gap-4">
        <div className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-md border border-slate-200 font-mono-tag shrink-0">
          #{rank}
        </div>
        <div className="flex flex-col gap-1 flex-1 max-w-[200px]">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Relevance</span>
            <span className="text-blue-600 font-semibold">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${barColor} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Title & Authors */}
      <div className="space-y-1">
        <Link to={`/PaperDetail?id=${paper.id}`}>
          <h2 className="text-xl font-bold font-serif-title text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {paper.title}
          </h2>
        </Link>
        <p className="text-sm text-slate-400">{paper.authors}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs border border-blue-200">
          <Hash className="w-3 h-3" />{paper.topic}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-xs border border-slate-200">
          <Calendar className="w-3 h-3" />{paper.year}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-200">
          <GraduationCap className="w-3 h-3" />{paper.venue}
        </span>
      </div>

      {/* Abstract */}
      <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-slate-200 pl-4">
        {paper.abstract_short}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100">
        <div className="flex gap-2 flex-wrap">
          {paper.keywords?.slice(0, 3).map(kw => (
            <span key={kw} className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {kw}
            </span>
          ))}
        </div>
        <Link
          to={`/PaperDetail?id=${paper.id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          View Paper <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
