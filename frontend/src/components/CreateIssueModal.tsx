import React, { useState } from 'react';
import type { CreateIssueDto, Epic, IssueStatus, IssueType } from '../types';
import { X, Bookmark, Bug, CheckSquare, Sparkles } from 'lucide-react';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateIssueDto, initialStatus?: IssueStatus) => void;
  epics: Epic[];
  defaultStatus?: IssueStatus;
}

const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13];

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  epics,
  defaultStatus = 'TODO',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('STORY');
  const [epicId, setEpicId] = useState<string>('');
  const [storyPoints, setStoryPoints] = useState<number | undefined>(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        issueType,
        epicId: epicId || undefined,
        storyPoints,
      },
      defaultStatus
    );

    // Reset form
    setTitle('');
    setDescription('');
    setIssueType('STORY');
    setStoryPoints(3);
    setEpicId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Create Work Item</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Issue Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Item Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIssueType('STORY')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  issueType === 'STORY'
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>User Story</span>
              </button>

              <button
                type="button"
                onClick={() => setIssueType('BUG')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  issueType === 'BUG'
                    ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Defect / Bug</span>
              </button>

              <button
                type="button"
                onClick={() => setIssueType('TASK')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  issueType === 'TASK'
                    ? 'border-sky-500/50 bg-sky-500/15 text-sky-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Task</span>
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. As a developer, I want quick keyboard shortcuts"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>

          {/* Epic & Story Points Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Epic Parent
              </label>
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="">None (Standalone)</option>
                {epics.map((epic) => (
                  <option key={epic.id} value={epic.id}>
                    {epic.key} — {epic.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Story Points (Fibonacci)
              </label>
              <div className="flex items-center gap-1.5">
                {FIBONACCI_POINTS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setStoryPoints(pts)}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      storyPoints === pts
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {pts}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description / Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context, details, or checklist of requirements..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
