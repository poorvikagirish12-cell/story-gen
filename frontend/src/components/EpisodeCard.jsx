import React from 'react';

const EpisodeCard = ({ script }) => {
  return (
    <div className="block p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-neonCyan hover:glow-cyan transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-neonCyan tracking-wider uppercase">
          Episode {script.episode_number}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neonCyan transition-colors">
        {script.title}
      </h3>
      <p className="text-slate-400 line-clamp-3">
        {script.script_summary}
      </p>
    </div>
  );
};

export default EpisodeCard;
