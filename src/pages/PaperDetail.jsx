import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPaperById, getAllPapers } from '../lib/supabaseClient';
import { initSearchEngine, searchPapers } from '../lib/ml';
import CitationModal from '../components/CitationModal';
import { ArrowLeft, ExternalLink, Download, Quote, Search, BookOpen } from 'lucide-react';

export default function PaperDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [related, setRelated] = useState([]);
  const [showCitation, setShowCitation] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const currentPaper = await getPaperById(id);
      if (currentPaper) setPaper(currentPaper);

      const allPapers = await getAllPapers();
      initSearchEngine(allPapers);

      if (currentPaper) {
        const relatedQuery = `${currentPaper.title} ${currentPaper.topic} ${currentPaper.keywords?.join(' ')}`;
        const relatedResults = searchPapers(relatedQuery, 4);
        setRelated(relatedResults.filter(r => r.paper.id !== currentPaper.id).slice(0, 3));
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (!id || !paper) return (
    <div className="w-full flex justify-center py-24 animate-pulse">
      <div className="w-full max-w-4xl space-y-6">
        <div className="h-10 w-3/4 bg-slate-200 rounded-lg"></div>
        <div className="h-6 w-1/2 bg-slate-200 rounded-lg"></div>
        <div className="h-48 w-full bg-slate-200 rounded-xl mt-8"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center pb-24 animate-fade-in">
      {showCitation && <CitationModal paper={paper} onClose={() => setShowCitation(false)} />}

      <div className="w-full max-w-4xl space-y-8">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-blue-600 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-200 text-xs font-medium">{paper.topic}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200 text-xs font-medium">{paper.year}</span>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-medium">{paper.venue}</span>
            {paper.arxiv_id && (
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-200 text-xs font-medium">
                arXiv:{paper.arxiv_id}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-serif-title text-slate-900 leading-tight">
            {paper.title}
          </h1>
          <p className="text-lg text-slate-500 font-medium">{paper.authors}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 py-6 border-y border-slate-200">
          <a
            href={paper.download_url || `https://arxiv.org/search/?query=${encodeURIComponent(paper.title)}&searchtype=all`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Paper
          </a>
          <button
            onClick={() => setShowCitation(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 px-6 py-2.5 rounded-xl font-medium transition-all"
          >
            <Quote className="w-4 h-4" /> Cite
          </button>
          <a
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 px-6 py-2.5 rounded-xl font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Google Scholar
          </a>
        </div>

        {/* Why this matches */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex gap-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600 h-fit shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1 font-serif-title">Why this matches your search</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based on our <strong>Semantic Similarity</strong> engine, this paper strongly correlates with your query. Its metadata overlaps with <strong>{paper.topic}</strong> and concepts spanning <em>{paper.keywords?.slice(0, 3).join(', ')}</em>.
            </p>
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-serif-title text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" /> Abstract
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">{paper.abstract_long || paper.abstract_full}</p>
        </div>

        {/* Keywords */}
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Keywords & Tags</h3>
          <div className="flex flex-wrap gap-2">
            {paper.keywords?.map(kw => (
              <span key={kw} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-sm hover:border-blue-400 hover:text-blue-600 cursor-default transition-colors">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Related Papers */}
        {related.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-slate-200 mt-12">
            <h2 className="text-2xl font-bold font-serif-title text-slate-900">Related Papers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(r => (
                <div
                  key={r.paper.id}
                  onClick={() => navigate(`/PaperDetail?id=${r.paper.id}`)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group"
                >
                  <span className="text-xs text-blue-500 font-medium">{Math.round(r.score)}% Match</span>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors mt-1 line-clamp-2 text-sm">{r.paper.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{r.paper.abstract_short}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
