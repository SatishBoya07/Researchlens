import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllPapers } from '../lib/supabaseClient';
import { initSearchEngine, searchPapers } from '../lib/ml';
import PaperCard from '../components/PaperCard';
import { Loader2, ArrowLeft, Filter } from 'lucide-react';

export default function Results() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [topN, setTopN] = useState(150);
  const [stats, setStats] = useState({ avgMatch: 0, domains: 0, yearRange: '' });

  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      const papers = await getAllPapers();
      initSearchEngine(papers);
      const scoredResults = searchPapers(query, topN);
      setResults(scoredResults);

      if (scoredResults.length > 0) {
        const avg = scoredResults.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / scoredResults.length;
        const uniqueDomains = new Set(scoredResults.map(r => r.paper.topic)).size;
        const years = scoredResults.map(r => r.paper.year);
        setStats({
          avgMatch: avg,
          domains: uniqueDomains,
          yearRange: `${Math.min(...years)} - ${Math.max(...years)}`
        });
      }
      setIsLoading(false);
    }
    performSearch();
  }, [query, topN]);

  return (
    <div className="w-full flex justify-center animate-fade-in pb-24">
      <div className="w-full max-w-4xl space-y-6">

        {/* Header & Stats Bar */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-4 z-30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-blue-600 flex items-center gap-2 text-sm font-medium mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> New Search
              </button>
              <h1 className="text-2xl font-bold font-serif-title text-slate-900">
                Results for <span className="text-blue-600 italic">"{query || 'Everything'}"</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Top</span>
              <select
                className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
                value={topN}
                onChange={(e) => setTopN(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={150}>150</option>
                <option value={500}>500</option>
                <option value={2000}>All</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Papers</span>
              <span className="text-slate-900 font-semibold">{results.length} Found</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Avg Match</span>
              <span className="text-blue-600 font-semibold">{stats.avgMatch.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Domains</span>
              <span className="text-slate-900 font-semibold">{stats.domains} Covered</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Timeline</span>
              <span className="text-slate-900 font-semibold">{stats.yearRange}</span>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4 flex flex-col items-center">
          {isLoading ? (
            <div className="py-20 flex flex-col justify-center items-center gap-4 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <p className="text-sm">Running TF-IDF Vectorization & Similarity Matching...</p>
            </div>
          ) : (
            results.map((res, index) => (
              <PaperCard
                key={res.paper.id}
                paper={res.paper}
                score={res.score}
                rank={index + 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
