import React, { useState } from 'react';
import type { EpicStatus } from '../types';
import { X, Check } from 'lucide-react';

interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, color: string, status: EpicStatus) => Promise<void>;
  projectKey: string;
}

const COLOR_PRESETS = [
  { name: 'Purple', hex: '#6554C0' },
  { name: 'Blue', hex: '#0052CC' },
  { name: 'Teal', hex: '#00875A' },
  { name: 'Orange', hex: '#FF8B00' },
  { name: 'Red', hex: '#DE350B' },
  { name: 'Magenta', hex: '#CD519D' },
];

export const CreateEpicModal: React.FC<CreateEpicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#6554C0');
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
      setColor('#6554C0');
      setStatus('OPEN');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded w-full max-w-md shadow-xl overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DFE1E6] dark:border-[#2C333A] bg-[#FAFBFC] dark:bg-[#1D2125]">
          <h3 className="text-sm font-semibold text-[#172B4D] dark:text-[#DEE4EA]">
            Create Epic
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
              Epic Name <span className="text-[#DE350B]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. [Phase 1] Authentication & JWT Security"
              className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] rounded px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] placeholder-[#8993A4] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
              Color Tag
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setColor(preset.hex)}
                  className="w-6 h-6 rounded flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                >
                  {color === preset.hex && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EpicStatus)}
              className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] rounded px-2.5 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
            >
              <option value="OPEN">Open (Planned)</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
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
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] dark:bg-[#579DFF] dark:hover:bg-[#85B8FF] dark:text-[#161A1D] text-white font-semibold text-xs rounded transition-colors disabled:opacity-40"
            >
              {isSubmitting ? 'Creating...' : 'Create Epic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
