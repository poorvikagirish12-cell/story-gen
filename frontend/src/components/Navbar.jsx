import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenTool } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple glow-text-cyan">
              StoryGen
            </span>
          </div>
          
          <div className="flex space-x-8">
            <NavLink 
              to="/"
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive && window.location.pathname === '/'
                  ? 'text-neonCyan bg-slate-800/80 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <LayoutDashboard size={18} />
              Script
            </NavLink>

            <NavLink 
              to="/story"
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'text-neonPurple bg-slate-800/80 shadow-[0_0_10px_rgba(188,19,254,0.2)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <PenTool size={18} />
              Story
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
