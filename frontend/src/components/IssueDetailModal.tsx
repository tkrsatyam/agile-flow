import React, { useState, useEffect } from 'react';
import type { Issue, Epic, IssueStatus, IssueType, UpdateIssueDto } from '../types';
import { 
  X, 
  Bookmark, 
  Bug, 
  CheckSquare, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Circle,
  Save
} from 'lucide-react';

interface IssueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  epics: Epic[];
  onUpdateIssue: (issueId: string, dto: UpdateIssueDto) => Promise<void>;
  onDeleteIssue: (issueId: string) => Promise<void>;
  onToggleSubtask: (subtaskId: string, completed: boolean, title: string) => void;
  onAddSubtask: (issueId: string, title: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
}

const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13];

const STATUS_OPTIONS: { status: IssueStatus; label: string }[] = [
  { status: 'TODO', label: 'To Do' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'REVIEW', label: 'In Review' },
  { status: 'DONE', label: 'Done' },
];

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  isOpen,
  onClose,
  issue,
  epics,
  onUpdateIssue,
  onDeleteIssue,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
}) => {
  if (!isOpen || !issue) return null;

  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || '');
  const [issueType, setIssueType] = useState<IssueType>(issue.issueType);
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [epicId, setEpicId] = useState<string>(issue.epicId || '');
  const [storyPoints, setStoryPoints] = useState<number | null>(issue.storyPoints ?? null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(issue.title);
    setDescription(issue.description || '');
    setIssueType(issue.issueType);
    setStatus(issue.status);
    setEpicId(issue.epicId || '');
    setStoryPoints(issue.storyPoints ?? null);
  }, [issue]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await onUpdateIssue(issue.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        issueType,
        status,
        epicId: epicId || null,
        storyPoints,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(issue.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${issue.key}?`)) {
      await onDeleteIssue(issue.id);
      onClose();
    }
  };

  const renderTypeIcon = () => {
    switch (issueType) {
      case 'BUG':
        return <Bug className="w-3.5 h-3.5 text-[#E5493A] fill-[#E5493A]/10" />;
      case 'TASK':
        return <CheckSquare className="w-3.5 h-3.5 text-[#0065FF] fill-[#0065FF]/10" />;
      case 'STORY':
      default:
        return <Bookmark className="w-3.5 h-3.5 text-[#36B37E] fill-[#36B37E]/20" />;
    }
  };

  const completedSubtasks = issue.subtasks?.filter((st) => st.isCompleted).length || 0;
  const totalSubtasks = issue.subtasks?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded w-full max-w-2xl max-h-[90vh] shadow-xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Jira Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#DFE1E6] dark:border-[#2C333A] bg-[#FAFBFC] dark:bg-[#1D2125]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#EBECF0] dark:bg-[#2C333A]">
              {renderTypeIcon()}
            </span>
            <span className="font-mono font-bold text-xs text-[#5E6C84] dark:text-[#8C9BAB]">
              {issue.key}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDelete}
              className="p-1.5 text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#DE350B] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors"
              title="Delete Issue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[11px]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] rounded px-3 py-1.5 text-sm font-medium text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
            />
          </div>

          {/* Grid Metadata: Status, Type, Epic, Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFBFC] dark:bg-[#161A1D] p-3 rounded border border-[#DFE1E6] dark:border-[#2C333A]">
            {/* Status */}
            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[10px]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
                className="w-full bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded px-2.5 py-1 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.status} value={opt.status}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[10px]">
                Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
                className="w-full bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded px-2.5 py-1 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
              >
                <option value="STORY">Story</option>
                <option value="BUG">Bug</option>
                <option value="TASK">Task</option>
              </select>
            </div>

            {/* Epic Parent */}
            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[10px]">
                Parent Epic
              </label>
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                className="w-full bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded px-2.5 py-1 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
              >
                <option value="">None (Standalone)</option>
                {epics.map((epic) => (
                  <option key={epic.id} value={epic.id}>
                    {epic.key} — {epic.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Story Points */}
            <div>
              <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[10px]">
                Story Points
              </label>
              <div className="flex items-center gap-1">
                {FIBONACCI_POINTS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setStoryPoints(storyPoints === pts ? null : pts)}
                    className={`flex-1 py-1 rounded font-mono text-xs font-bold border transition-colors ${
                      storyPoints === pts
                        ? 'bg-[#0052CC] text-white border-[#0052CC]'
                        : 'bg-white dark:bg-[#22272B] border-[#DFE1E6] dark:border-[#38414A] text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0]'
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
            <label className="block font-semibold text-[#5E6C84] dark:text-[#8C9BAB] mb-1 uppercase text-[11px]">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description or acceptance criteria..."
              className="w-full bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] focus:bg-white dark:focus:bg-[#1D2125] focus:border-[#0052CC] rounded px-3 py-2 text-xs text-[#172B4D] dark:text-[#DEE4EA] placeholder-[#8993A4] focus:outline-none focus:ring-1 focus:ring-[#0052CC] resize-y"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-[#5E6C84] dark:text-[#8C9BAB] uppercase text-[11px]">
                Checklist ({completedSubtasks}/{totalSubtasks})
              </label>
              {totalSubtasks > 0 && (
                <span className="font-mono text-[#006644] dark:text-[#7EE2B8]">
                  {Math.round((completedSubtasks / totalSubtasks) * 100)}%
                </span>
              )}
            </div>

            {/* List */}
            <div className="space-y-1 mb-2">
              {issue.subtasks?.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-1.5 rounded bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#2C333A] hover:bg-white dark:hover:bg-[#1D2125] group"
                >
                  <div
                    onClick={() => onToggleSubtask(st.id, !st.isCompleted, st.title)}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    {st.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36B37E] shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-[#8993A4] shrink-0" />
                    )}
                    <span className={st.isCompleted ? 'line-through text-[#8993A4]' : 'text-[#172B4D] dark:text-[#DEE4EA]'}>
                      {st.title}
                    </span>
                  </div>

                  {onDeleteSubtask && (
                    <button
                      onClick={() => onDeleteSubtask(st.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-[#8993A4] hover:text-[#DE350B]"
                      title="Delete subtask"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 bg-[#FAFBFC] dark:bg-[#161A1D] border border-[#DFE1E6] dark:border-[#38414A] rounded px-2.5 py-1 text-xs text-[#172B4D] dark:text-[#DEE4EA] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-2.5 py-1 bg-[#EBECF0] dark:bg-[#2C333A] hover:bg-[#DFE1E6] disabled:opacity-40 text-[#172B4D] dark:text-[#DEE4EA] font-semibold text-xs rounded transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-2.5 border-t border-[#DFE1E6] dark:border-[#2C333A] bg-[#FAFBFC] dark:bg-[#1D2125]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="px-4 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] dark:bg-[#579DFF] dark:hover:bg-[#85B8FF] dark:text-[#161A1D] text-white font-semibold text-xs rounded flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
