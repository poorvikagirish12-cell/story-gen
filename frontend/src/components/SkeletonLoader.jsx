import React from 'react';
import { Loader2 } from 'lucide-react';

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <Loader2 className="w-12 h-12 text-neonCyan animate-spin" />
      <div className="space-y-4 w-full max-w-2xl animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto glow-cyan"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6 mx-auto"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
      </div>
      <p className="text-neonCyan glow-text-cyan font-semibold tracking-widest uppercase mt-4">
        Synthesizing Narrative...
      </p>
    </div>
  );
};

export default SkeletonLoader;
