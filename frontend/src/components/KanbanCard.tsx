import React, { useState } from 'react';
import type { Issue, IssueStatus } from '../types';
import { 
  Bookmark, 
  Bug, 
  CheckSquare, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2,
  GripVertical
} from 'lucide-react';

interface KanbanCardProps {
  issue: Issue;
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
  onDelete: (issueId: string) => void;
  onToggleSubtask: (subtaskId: string, completed: boolean, title: string) => void;
  onAddSubtask: (issueId: string, title: string) => void;
  onClick?: (issue: Issue) => void;
  isDragging?: boolean;
}

const STATUS_ORDER: IssueStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

export const KanbanCard: React.FC<KanbanCardProps> = ({
  issue,
  onStatusChange,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onClick,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const completedSubtasks = issue.subtasks?.filter(st => st.isCompleted).length || 0;
  const totalSubtasks = issue.subtasks?.length || 0;

  const currentStatusIdx = STATUS_ORDER.indexOf(issue.status);
  const canMovePrev = currentStatusIdx > 0;
  const canMoveNext = currentStatusIdx < STATUS_ORDER.length - 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveNext) {
      onStatusChange(issue.id, STATUS_ORDER[currentStatusIdx + 1]);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMovePrev) {
      onStatusChange(issue.id, STATUS_ORDER[currentStatusIdx - 1]);
    }
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(issue.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  const renderTypeIcon = () => {
    switch (issue.issueType) {
      case 'BUG':
        return <Bug className="w-3.5 h-3.5 text-rose-400" />;
      case 'TASK':
        return <CheckSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'STORY':
      default:
        return <Bookmark className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onClick?.(issue)}
      className="group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer active:cursor-grabbing select-none"
    >
      {/* Top Header: Key, Type, Epic, Points */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="p-1 rounded bg-slate-700/60 flex items-center justify-center">
            {renderTypeIcon()}
          </span>
          <span className="text-xs font-mono font-semibold text-slate-300">
            {issue.key}
          </span>
          {issue.epicTitle && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-opacity-40"
              style={{
                borderColor: issue.epicColor || '#6366F1',
                color: issue.epicColor || '#6366F1',
                backgroundColor: `${issue.epicColor || '#6366F1'}15`,
              }}
            >
              {issue.epicTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {issue.storyPoints !== null && issue.storyPoints !== undefined && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {issue.storyPoints} {issue.storyPoints === 1 ? 'pt' : 'pts'}
            </span>
          )}
          <button
            onClick={() => onDelete(issue.id)}
            title="Delete issue"
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-slate-100 leading-snug mb-1.5">
        {issue.title}
      </h4>

      {/* Description Snippet */}
      {issue.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
          {issue.description}
        </p>
      )}

      {/* Subtask Checklist Summary */}
      {totalSubtasks > 0 && (
        <div className="mt-2.5 pt-2 border-t border-slate-700/60">
          <button
            type="button"
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center justify-between w-full text-left text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Checklist ({completedSubtasks}/{totalSubtasks})</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {showSubtasks ? 'Hide' : 'Show'}
            </span>
          </button>

          {/* Subtask Progress Bar */}
          <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
            />
          </div>

          {/* Expanded Subtask List */}
          {showSubtasks && (
            <div className="mt-2 space-y-1.5 pl-1">
              {issue.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(st.id, !st.isCompleted, st.title)}
                  className="flex items-center gap-2 text-xs cursor-pointer hover:text-slate-200 text-slate-300 transition-colors"
                >
                  {st.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={st.isCompleted ? 'line-through text-slate-400' : ''}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Subtask Form */}
      {showSubtasks && (
        <div className="mt-2 pt-2 border-t border-slate-700/40">
          {isAddingSubtask ? (
            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Checklist item..."
                autoFocus
                className="flex-1 bg-slate-900/80 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSubtask(false)}
                className="px-1.5 py-1 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingSubtask(true)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add item
            </button>
          )}
        </div>
      )}

      {/* Quick Move Footer (Mobile & Desktop Touch Quick Moves) */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
        <button
          onClick={handlePrev}
          disabled={!canMovePrev}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors ${
            canMovePrev ? 'hover:bg-slate-700 hover:text-slate-200 text-slate-400' : 'opacity-20 cursor-not-allowed'
          }`}
          title="Move back"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
          <GripVertical className="w-3 h-3 text-slate-400" />
          <span>Drag or Move</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!canMoveNext}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors ${
            canMoveNext ? 'hover:bg-slate-700 hover:text-slate-200 text-slate-400' : 'opacity-20 cursor-not-allowed'
          }`}
          title="Advance to next column"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
