import React from 'react';
import type { Project } from '../types';
import { Plus, Zap, Monitor, Smartphone, FolderKanban, ChevronDown, Layers } from 'lucide-react';

interface NavbarProps {
  currentProject: Project | null;
  onOpenCreateModal: () => void;
  onOpenWorkspaceModal: () => void;
  onOpenEpicModal: () => void;
  isBackendConnected: boolean;
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  onOpenCreateModal,
  onOpenWorkspaceModal,
  onOpenEpicModal,
  isBackendConnected,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AgileFlow
            </span>
          </div>

          {/* Interactive Workspace Switcher Button */}
          <button
            onClick={onOpenWorkspaceModal}
            className="flex items-center gap-2 pl-3 pr-2.5 py-1 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/60 transition-all text-left group"
            title="Switch or create project workspace"
          >
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono border border-slate-700/60">
              {currentProject?.key || 'FLOW'}
            </span>
            <span className="text-xs text-slate-300 group-hover:text-white truncate max-w-[140px] sm:max-w-[200px] hidden sm:inline">
              {currentProject?.name || 'AgileFlow MVP'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Connection Status Pill */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isBackendConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
            title={isBackendConnected ? 'Connected to Spring Boot API' : 'Running with local state fallback'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isBackendConnected ? 'API Connected' : 'Local Sandbox'}</span>
          </div>

          {/* New Epic Trigger */}
          <button
            onClick={onOpenEpicModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors"
            title="Create new Epic"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ Epic</span>
          </button>

          {/* View Mode Switcher */}
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors"
            title={`Switch to ${viewMode === 'desktop' ? 'Mobile Focus' : 'Desktop 4-Col'} view`}
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Mobile Focus</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Desktop Board</span>
              </>
            )}
          </button>

          {/* Create Issue Primary Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Issue</span>
          </button>
        </div>
      </div>
    </header>
  );
};
