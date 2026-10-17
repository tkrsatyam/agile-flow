import React, { useState } from 'react';
import type { Project } from '../types';
import { X, Plus, Check, Briefcase, ArrowRight } from 'lucide-react';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (key: string, name: string, description?: string) => Promise<void>;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'create'>('switch');
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeyChange = (val: string) => {
    // Only uppercase alphanumeric, max 10 chars
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setNewKey(cleaned);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateProject(newKey.trim(), newName.trim(), newDesc.trim() || undefined);
      setNewKey('');
      setNewName('');
      setNewDesc('');
      setActiveTab('switch');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Project Workspaces</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3">
          <button
            type="button"
            onClick={() => { setActiveTab('switch'); setError(null); }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'switch'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Switch Workspace ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('create'); setError(null); }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'create'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Workspace</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Tab 1: List & Switch Workspaces */}
        {activeTab === 'switch' && (
          <div className="p-6 space-y-3 max-h-[360px] overflow-y-auto">
            {projects.map((proj) => {
              const isCurrent = proj.id === currentProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-indigo-600/10 border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
                      {proj.key}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">{proj.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Active
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{proj.description}</p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                </div>
              );
            })}

            <button
              onClick={() => setActiveTab('create')}
              className="w-full py-3 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Another Project Workspace</span>
            </button>
          </div>
        )}

        {/* Tab 2: Create New Workspace */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Workspace Key Prefix <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={10}
                placeholder="e.g. FLOW, PROJ, MOBILE"
                value={newKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase tracking-wider text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                2-10 uppercase characters. Work items will be keyed as{' '}
                <span className="font-mono text-indigo-400">{newKey ? `${newKey}-1` : 'KEY-1'}</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mobile Companion App"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Purpose, target users, or scope..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('switch')}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newKey.trim() || !newName.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                {isSubmitting ? 'Creating...' : 'Create Workspace'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
