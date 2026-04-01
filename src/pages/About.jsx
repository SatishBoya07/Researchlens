import { BookOpen, Users, Cpu, Code2, ShieldAlert, CheckCircle2, FileText, Search, Database, GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full flex justify-center animate-fade-in pb-24">
      <div className="w-full max-w-5xl space-y-20 mt-12 px-4">

        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif-title text-slate-900">About ScholarLens</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A Research Paper Recommendation System Based on Project Idea Using Semantic Similarity
          </p>
        </div>

        {/* Abstract */}
        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm">
          <div className="flex items-start gap-6">
            <div className="shrink-0 bg-blue-50 p-4 rounded-full border border-blue-200 mt-1">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-5">
              <h2 className="text-2xl font-bold font-serif-title text-slate-900">Project Abstract</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>In the modern era of rapid technological advancement, the volume of academic research publications has increased exponentially. This project proposes a Research Paper Recommendation System based on semantic similarity that intelligently recommends research papers according to a user's project idea.</p>
                <p>The system employs machine learning and NLP techniques to extract semantic meaning from textual content such as research paper titles and abstracts. By generating vector-based semantic embeddings and applying cosine similarity, the system efficiently identifies and ranks the most relevant papers.</p>
                <p className="text-slate-400 border-l-2 border-slate-200 pl-4">The system focuses on Machine Learning, Artificial Intelligence, and related domains. Datasets such as ArXiv, IEEE DataPort, Semantic Scholar Open Research Corpus, and Kaggle are used for evaluation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold font-serif-title text-center text-slate-900">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "NLP & Sentence Embeddings", desc: "BERT / Sentence-BERT based semantic representations", icon: <BookOpen className="w-5 h-5 text-blue-600" /> },
              { title: "Cosine Similarity", desc: "Vector-based similarity computation for ranking", icon: <CheckCircle2 className="w-5 h-5 text-blue-600" /> },
              { title: "Vector Database", desc: "Efficient storage and retrieval of paper embeddings", icon: <Database className="w-5 h-5 text-blue-600" /> },
              { title: "FAISS Indexing", desc: "Fast approximate nearest neighbor search", icon: <Search className="w-5 h-5 text-blue-600" /> },
              { title: "React + Tailwind", desc: "Modern responsive frontend framework", icon: <Code2 className="w-5 h-5 text-blue-600" /> },
              { title: "ArXiv & IEEE Datasets", desc: "Curated research paper collections", icon: <FileText className="w-5 h-5 text-blue-600" /> },
            ].map((tech, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="bg-blue-50 p-4 rounded-full border border-blue-200">{tech.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{tech.title}</h3>
                  <p className="text-sm text-slate-500">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Team */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold font-serif-title text-center text-slate-900">Project Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Yalavarthi Dhyanalakshmi", rno: "23881A05X8", email: "Dhyanalakshmi1@gmail.com" },
              { name: "Keesari Mahanth Vibhav", rno: "23881A05U5", email: "varunkisara@gmail.com" },
              { name: "Satish Boya", rno: "23881A05S7", email: "Satishboya8074@gmail.com" },
            ].map(member => (
              <div key={member.rno} className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition-all">
                <div className="bg-blue-50 p-4 rounded-full border border-blue-200 mb-4">
                  <GraduationCap className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{member.name}</h3>
                <span className="text-sm text-slate-400 mb-2">{member.rno}</span>
                <a href={`mailto:${member.email}`} className="text-sm text-blue-500 hover:underline">{member.email}</a>
              </div>
            ))}
          </div>
        </div>

        {/* Guide */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white border border-slate-200 p-10 rounded-3xl text-center relative overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="bg-blue-50 p-4 rounded-full border border-blue-200 mx-auto w-fit mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Project Guide</p>
            <h3 className="text-2xl font-bold font-serif-title text-slate-900 mb-1">Ms. Keerthi Pendam</h3>
            <p className="text-blue-600 font-medium mb-4">Assistant Professor</p>
            <p className="text-slate-500 text-sm">Department of CSE · Vardhaman College of Engineering, Hyderabad</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-slate-600 font-medium">ScholarLens — Research Paper Recommendation System</p>
          <p className="text-slate-400 text-sm mt-2">Built with Semantic Similarity & NLP · Vardhaman College of Engineering</p>
        </div>

      </div>
    </div>
  );
}
