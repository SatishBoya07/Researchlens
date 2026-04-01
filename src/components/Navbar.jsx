import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (targetPath) => {
    const isActive = path === targetPath || (targetPath === '/results' && path.startsWith('/results'));
    return `text-sm font-medium px-4 py-2 rounded-lg transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-blue-50 p-2 rounded-xl border border-blue-200 group-hover:border-blue-400 transition-all">
            <BookOpen className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0 leading-none font-serif-title">ScholarLens</h1>
            <span className="text-[10px] text-slate-400 font-mono-tag uppercase tracking-widest">Research AI</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/results" className={getLinkClass('/results')}>Search</Link>
          <Link to="/about" className={getLinkClass('/about')}>About</Link>
        </nav>
      </div>
    </header>
  );
}
