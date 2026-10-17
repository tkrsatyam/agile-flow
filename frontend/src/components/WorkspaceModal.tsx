import React, { useState } from 'react';
import type { Project } from '../types';
import { X, Plus, Check, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded w-full max-w-lg shadow-xl overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DFE1E6] dark:border-[#2C333A] bg-[#FAFBFC] dark:bg-[#1D2125]">
          <h3 className="text-sm font-semibold text-[#172B4D] dark:text-[#DEE4EA]">
            Projects & Workspaces
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#DFE1E6] dark:border-[#2C333A] bg-[#FAFBFC] dark:bg-[#1D2125] px-5">
          <button
            type="button"
            onClick={() => { setActiveTab('switch'); setError(null); }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'switch'
                ? 'border-[#0052CC] text-[#0052CC] dark:border-[#579DFF] dark:text-[#579DFF]'
                : 'border-transparent text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA]'
            }`}
          >
            Switch Project ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('create'); setError(null); }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1 transition-colors ${
              activeTab === 'create'
                ? 'border-[#0052CC] text-[#0052CC] dark:border-[#579DFF] dark:text-[#579DFF]'
                : 'border-transparent text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-3 p-2.5 rounded bg-[#FFEBE6] dark:bg-[#3D1E1B] border border-[#FF8F73] text-[#DE350B] dark:text-[#FF8F73] text-xs">
            {error}
          </div>
        )}

        {/* Tab 1: List & Switch Projects */}
        {activeTab === 'switch' && (
          <div className="p-5 space-y-2 max-h-[360px] overflow-y-auto">
            {projects.map((proj) => {
              const isCurrent = proj.id === currentProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj.id);
                    onClose();
                  }}
                  className={`p-3 rounded border flex items-center justify-between cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-[#DEEBFF]/40 border-[#0052CC] dark:bg-[#1D2B41] dark:border-[#579DFF]'
                      : 'bg-[#FAFBFC] dark:bg-[#161A1D] border-[#DFE1E6] dark:border-[#2C333A] hover:bg-white dark:hover:bg-[#1D2125]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFAB00] text-[#172B4D] font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                      {proj.key}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#172B4D] dark:text-[#DEE4EA]">{proj.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#E3FCEF] text-[#006644] dark:bg-[#1C3329] dark:text-[#7EE2B8] flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-[11px] text-[#5E6C84] dark:text-[#8C9BAB] line-clamp-1 mt-0.5">{proj.description}</p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#8993A4] dark:text-[#626F86]" />
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Create Project Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5">
            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[11px]">
                Project Name <span className="text-[#DE350B]">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (!newKey && e.target.value.length >= 2) {
                    const words = e.target.value.split(/\s+/).filter(Boolean);
                    if (words.length >= 2) {
                      setNewKey(words.map((w) => w[0].toUpperCase()).join('').slice(0, 5));
                    } else {
                      setNewKey(e.target.value.slice(0, 4).toUpperCase());
                    }
                  }
                }}
                placeholder="e.g. Orbit Delivery Management"
                className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] rounded px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[11px]">
                Key Prefix <span className="text-[#DE350B]">*</span>
              </label>
              <input
                type="text"
                required
                value={newKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="e.g. ORDM"
                className="w-full font-mono uppercase bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] rounded px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[11px]">
                Description
              </label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief project mission..."
                className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] rounded px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DFE1E6] dark:border-[#2C333A]">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newKey.trim() || !newName.trim()}
                className="px-4 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] dark:bg-[#579DFF] dark:hover:bg-[#85B8FF] dark:text-[#161A1D] text-white font-semibold text-xs rounded transition-colors disabled:opacity-40"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
