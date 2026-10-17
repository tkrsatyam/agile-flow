import React, { useState } from 'react';
import type { CreateIssueDto, Epic, IssueStatus, IssueType } from '../types';
import { X, Bookmark, Bug, CheckSquare } from 'lucide-react';

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

    setTitle('');
    setDescription('');
    setIssueType('STORY');
    setStoryPoints(3);
    setEpicId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div 
        className="bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded w-full max-w-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Atlassian Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DFE1E6] dark:border-[#2C333A]">
          <h3 className="text-sm font-semibold text-[#172B4D] dark:text-[#DEE4EA]">
            Create issue
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Issue Type Selector */}
          <div>
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
              Issue Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIssueType('STORY')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border text-xs font-medium transition-colors ${
                  issueType === 'STORY'
                    ? 'border-[#0052CC] bg-[#DEEBFF] dark:bg-[#1D2B41] text-[#0052CC] dark:text-[#579DFF]'
                    : 'border-[#DFE1E6] dark:border-[#38414A] bg-white dark:bg-[#1D2125] text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#F4F5F7]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#36B37E]" />
                <span>Story</span>
              </button>

              <button
                type="button"
                onClick={() => setIssueType('BUG')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border text-xs font-medium transition-colors ${
                  issueType === 'BUG'
                    ? 'border-[#E5493A] bg-[#FFEBE6] dark:bg-[#3D1E1B] text-[#BF2600] dark:text-[#FF8F73]'
                    : 'border-[#DFE1E6] dark:border-[#38414A] bg-white dark:bg-[#1D2125] text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#F4F5F7]'
                }`}
              >
                <Bug className="w-3.5 h-3.5 text-[#E5493A]" />
                <span>Bug</span>
              </button>

              <button
                type="button"
                onClick={() => setIssueType('TASK')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border text-xs font-medium transition-colors ${
                  issueType === 'TASK'
                    ? 'border-[#0065FF] bg-[#DEEBFF] dark:bg-[#1D2B41] text-[#0052CC] dark:text-[#579DFF]'
                    : 'border-[#DFE1E6] dark:border-[#38414A] bg-white dark:bg-[#1D2125] text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#F4F5F7]'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#0065FF]" />
                <span>Task</span>
              </button>
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
              Summary <span className="text-[#DE350B]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. User Registration & Login with Email/Password"
              className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] dark:focus:border-[#579DFF] rounded px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] placeholder-[#8993A4] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
            />
          </div>

          {/* Epic & Story Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
                Parent Epic
              </label>
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] rounded px-2.5 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
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
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
                Story Points (Fibonacci)
              </label>
              <div className="flex items-center gap-1">
                {FIBONACCI_POINTS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setStoryPoints(pts)}
                    className={`flex-1 py-1 rounded font-mono text-xs font-bold border transition-colors ${
                      storyPoints === pts
                        ? 'bg-[#0052CC] text-white border-[#0052CC]'
                        : 'bg-white dark:bg-[#1D2125] border-[#DFE1E6] dark:border-[#38414A] text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#F4F5F7]'
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
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1.5 uppercase text-[11px]">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context, technical notes, or acceptance criteria..."
              className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] dark:focus:border-[#579DFF] rounded px-3 py-1.5 text-xs text-[#172B4D] dark:text-[#DEE4EA] placeholder-[#8993A4] focus:outline-none focus:ring-1 focus:ring-[#0052CC] resize-none"
            />
          </div>

          {/* Actions */}
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
              disabled={!title.trim()}
              className="px-4 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] dark:bg-[#579DFF] dark:hover:bg-[#85B8FF] dark:text-[#161A1D] text-white font-semibold text-xs rounded transition-colors disabled:opacity-40"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
