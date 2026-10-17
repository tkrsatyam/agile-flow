import React, { useState } from 'react';
import type { EpicStatus } from '../types';
import { X, Layers, Check } from 'lucide-react';

interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, color: string, status: EpicStatus) => Promise<void>;
  projectKey: string;
}

const COLOR_PRESETS = [
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Cyan', hex: '#06B6D4' },
];

export const CreateEpicModal: React.FC<CreateEpicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectKey,
}) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [status, setStatus] = useState<EpicStatus>('OPEN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), color, status);
      setTitle('');
      setColor('#6366F1');
      setStatus('OPEN');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Create Epic Parent</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Epic Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. User Authentication & Security"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Will be assigned key <span className="font-mono text-indigo-400">{projectKey}-E#</span>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setColor(preset.hex)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                >
                  {color === preset.hex && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EpicStatus)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Create Epic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
