import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, ChevronRight } from 'lucide-react';

const DOMAINS = [
  "Deep Learning", "NLP", "Computer Vision",
  "Reinforcement Learning", "Generative AI", "Transformers",
  "Recommendation Systems", "Explainable AI"
];

const EXAMPLES = [
  "Image classification using CNN",
  "Transformer models for NLP",
  "Reinforcement learning in robotics",
  "Generative adversarial networks",
  "Federated learning for privacy",
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const tryExample = (ex) => {
    setQuery(ex);
    setTimeout(() => navigate(`/results?q=${encodeURIComponent(ex)}`), 50);
  };

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center px-4 py-16 text-center">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-medium mb-8">
        <Sparkles className="w-4 h-4" />
        Powered by Semantic Similarity &amp; NLP
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl font-bold font-serif-title leading-tight text-slate-900 mb-4 max-w-3xl">
        Discover Research Papers<br />
        <span className="text-blue-600">That Match Your Ideas</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed">
        Enter your project idea or research topic and our AI-powered system will find
        the most relevant papers using machine learning and semantic embeddings.
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mb-5">
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-3 gap-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-400"
            placeholder="Describe your project idea or research topic..."
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shrink-0"
          >
            Search <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Try examples */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
        <span className="text-sm text-slate-400 font-medium mr-1">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => tryExample(ex)}
            className="text-sm px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Domain pills */}
      <div className="w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Filter by Domain</p>
        <div className="flex flex-wrap justify-center gap-2">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => setQuery(domain)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
