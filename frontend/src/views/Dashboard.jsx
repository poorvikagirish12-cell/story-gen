import React, { useState, useContext } from 'react';
import { ScriptContext } from '../context/ScriptContext';
import { useTaskPolling } from '../hooks/useTaskPolling';
import EpisodeCard from '../components/EpisodeCard';
import { Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const { seriesList, fetchScripts } = useContext(ScriptContext);
  const { isPolling, startPolling } = useTaskPolling();
  const [expandedSeries, setExpandedSeries] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/generate-scripts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) throw new Error('Failed to start generation');
      
      const data = await response.json();
      toast.success('Concept accepted. Generating new series arc...');
      
      startPolling(data.task_id, () => {
        fetchScripts();
      });
      
    } catch (error) {
      toast.error('Network error initiating generation.');
      console.error(error);
    }
  };

  const toggleSeries = (id) => {
    if (expandedSeries === id) setExpandedSeries(null);
    else setExpandedSeries(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple mb-4 glow-text-cyan">
          StoryGen Interface
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Input your high-level concept. The AI will generate a thematic title and weave a multi-episode narrative arc.
        </p>
        
        <form onSubmit={handleGenerate} className="max-w-3xl mx-auto flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A rogue AI learning to paint in a cyberpunk city..."
            disabled={isPolling}
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan transition-all"
          />
          <button
            type="submit"
            disabled={isPolling || !prompt.trim()}
            className="bg-neonCyan hover:bg-cyan-400 text-slate-900 font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          >
            {isPolling ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {isPolling ? 'Synthesizing...' : 'Generate Series'}
          </button>
        </form>
      </div>

      {/* Series List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-8">
          <h2 className="text-2xl font-bold text-white tracking-wide">Generated Series</h2>
          <span className="text-neonCyan">{seriesList.length} records found</span>
        </div>
        
        {seriesList.length === 0 && !isPolling ? (
          <div className="text-center py-20 text-slate-500">
            No series found in the databanks. Initiate a generation sequence above.
          </div>
        ) : (
          <div className="space-y-6">
            {seriesList.map(series => (
              <div key={series.id} className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden transition-all">
                {/* Series Header (Accordion Toggle) */}
                <div 
                  className="p-6 cursor-pointer hover:bg-slate-800/60 transition-colors flex items-start justify-between"
                  onClick={() => toggleSeries(series.id)}
                >
                  <div className="flex-1 pr-8">
                    <h3 className="text-3xl font-bold text-white mb-2">{series.title}</h3>
                    <p className="text-slate-400 text-sm">{series.concept}</p>
                  </div>
                  <div className="flex items-center gap-4 text-neonCyan mt-2">
                    <span className="text-sm font-semibold tracking-wider uppercase">
                      {series.scripts.length} Episodes
                    </span>
                    {expandedSeries === series.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {/* Series Content (Episodes Grid) */}
                {expandedSeries === series.id && (
                  <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {series.scripts.map(script => (
                        <EpisodeCard key={script.id} script={script} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
