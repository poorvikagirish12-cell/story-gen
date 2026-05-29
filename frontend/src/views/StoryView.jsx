import React, { useContext, useState, useEffect } from 'react';
import { ScriptContext } from '../context/ScriptContext';
import { useTaskPolling } from '../hooks/useTaskPolling';
import SkeletonLoader from '../components/SkeletonLoader';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const StoryView = () => {
  const { seriesList } = useContext(ScriptContext);
  const { isPolling, result: storyResult, startPolling } = useTaskPolling();
  
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [selectedScriptId, setSelectedScriptId] = useState('');
  const [localStory, setLocalStory] = useState(null);

  const selectedSeries = seriesList.find(s => s.id === parseInt(selectedSeriesId));
  const selectedScript = selectedSeries?.scripts?.find(s => s.id === parseInt(selectedScriptId));

  // Reset script selection if series changes
  useEffect(() => {
    setSelectedScriptId('');
    setLocalStory(null);
  }, [selectedSeriesId]);

  const handleGenerateStory = async () => {
    if (!selectedScriptId) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/generate-story/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script_id: selectedScriptId })
      });
      
      if (!response.ok) throw new Error('Failed to start story generation');
      
      const data = await response.json();
      toast.success('Initiating deep narrative synthesis (2000+ words)...');
      setLocalStory(null);
      
      startPolling(data.task_id, (resultData) => {
        setLocalStory(resultData.story);
      });
      
    } catch (error) {
      toast.error('Network error initiating story generation.');
      console.error(error);
    }
  };

  const displayStory = localStory || (storyResult && storyResult.story);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Selection UI */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-neonPurple shadow-[0_0_15px_rgba(188,19,254,0.6)]"></div>
        <h2 className="text-2xl font-bold text-white tracking-wide mb-6">Select a Script to Generate</h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Series</label>
            <select
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
              disabled={isPolling}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all"
            >
              <option value="">-- Choose a Series --</option>
              {seriesList.map(series => (
                <option key={series.id} value={series.id}>{series.title}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Episode</label>
            <select
              value={selectedScriptId}
              onChange={(e) => setSelectedScriptId(e.target.value)}
              disabled={!selectedSeriesId || isPolling}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all disabled:opacity-50"
            >
              <option value="">-- Choose an Episode --</option>
              {selectedSeries?.scripts.map(script => (
                <option key={script.id} value={script.id}>
                  Ep {script.episode_number}: {script.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedScript && (
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 mb-8">
            <h4 className="text-neonCyan font-bold tracking-widest uppercase mb-2">
              Episode {selectedScript.episode_number}
            </h4>
            <h1 className="text-3xl font-extrabold text-white mb-4">
              {selectedScript.title}
            </h1>
            <p className="text-slate-300 leading-relaxed">
              {selectedScript.script_summary}
            </p>
          </div>
        )}
        
        <button
          onClick={handleGenerateStory}
          disabled={!selectedScriptId || isPolling}
          className="bg-neonPurple hover:bg-fuchsia-500 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(188,19,254,0.4)] hover:shadow-[0_0_25px_rgba(188,19,254,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          <BookOpen size={20} /> Generate Extended Narrative
        </button>
      </div>

      {/* Generation Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[400px]">
        {isPolling ? (
          <SkeletonLoader />
        ) : displayStory && selectedScriptId ? (
          <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-a:text-neonCyan">
            {displayStory.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20">
            <BookOpen size={48} className="opacity-20" />
            <p>The canvas is blank. Select an episode and initiate synthesis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryView;
