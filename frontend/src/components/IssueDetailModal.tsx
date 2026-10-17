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

const STATUS_OPTIONS: { status: IssueStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To Do', color: '#94A3B8' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: '#38BDF8' },
  { status: 'REVIEW', label: 'In Review', color: '#F59E0B' },
  { status: 'DONE', label: 'Done', color: '#10B981' },
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
        return <Bug className="w-4 h-4 text-rose-400" />;
      case 'TASK':
        return <CheckSquare className="w-4 h-4 text-sky-400" />;
      case 'STORY':
      default:
        return <Bookmark className="w-4 h-4 text-emerald-400" />;
    }
  };

  const completedSubtasks = issue.subtasks?.filter((st) => st.isCompleted).length || 0;
  const totalSubtasks = issue.subtasks?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
              {renderTypeIcon()}
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-slate-400">{issue.key}</span>
              <span className="text-xs text-slate-400 ml-2">in {issue.projectKey}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete Issue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-base font-medium text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Grid Controls: Status, Type, Epic, Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.status} value={opt.status}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="STORY">User Story</option>
                <option value="BUG">Defect / Bug</option>
                <option value="TASK">Task</option>
              </select>
            </div>

            {/* Epic Parent */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Epic Parent
              </label>
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Story Points
              </label>
              <div className="flex items-center gap-1.5">
                {FIBONACCI_POINTS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setStoryPoints(storyPoints === pts ? null : pts)}
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
              Description & Acceptance Criteria
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context, technical notes, or definition of done..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Checklist ({completedSubtasks}/{totalSubtasks})
              </label>
              {totalSubtasks > 0 && (
                <span className="text-xs font-mono text-emerald-400">
                  {Math.round((completedSubtasks / totalSubtasks) * 100)}% Complete
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%`,
                }}
              />
            </div>

            {/* List */}
            <div className="space-y-2 mb-3">
              {issue.subtasks?.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 group transition-colors"
                >
                  <div
                    onClick={() => onToggleSubtask(st.id, !st.isCompleted, st.title)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1"
                  >
                    {st.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        st.isCompleted ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>

                  {onDeleteSubtask && (
                    <button
                      onClick={() => onDeleteSubtask(st.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                      title="Delete subtask"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
