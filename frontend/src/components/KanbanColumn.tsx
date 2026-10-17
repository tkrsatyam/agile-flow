import React, { useState } from 'react';
import type { Issue, IssueStatus } from '../types';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: IssueStatus;
  title: string;
  color: string;
  issues: Issue[];
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
  onDeleteIssue: (issueId: string) => void;
  onToggleSubtask: (subtaskId: string, completed: boolean, title: string) => void;
  onAddSubtask: (issueId: string, title: string) => void;
  onOpenCreateModal: (defaultStatus: IssueStatus) => void;
  onCardClick?: (issue: Issue) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  color,
  issues,
  onStatusChange,
  onDeleteIssue,
  onToggleSubtask,
  onAddSubtask,
  onOpenCreateModal,
  onCardClick,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const totalPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const issueId = e.dataTransfer.getData('text/plain');
    if (issueId) {
      onStatusChange(issueId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[400px] h-full bg-slate-900/60 rounded-2xl border transition-all duration-200 ${
        isDragOver
          ? 'border-indigo-500/80 bg-slate-800/40 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/30'
          : 'border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-medium">
            {issues.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {totalPoints > 0 && (
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
              {totalPoints} pts
            </span>
          )}
          <button
            onClick={() => onOpenCreateModal(status)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={`Add story to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards List / Drop Target */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-210px)] min-h-[300px]">
        {issues.length === 0 ? (
          <div
            onClick={() => onOpenCreateModal(status)}
            className="h-32 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-slate-700 hover:text-slate-400 cursor-pointer transition-colors p-4 text-center"
          >
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Drop issue here or click to add</span>
          </div>
        ) : (
          issues.map((issue) => (
            <KanbanCard
              key={issue.id}
              issue={issue}
              onStatusChange={onStatusChange}
              onDelete={onDeleteIssue}
              onToggleSubtask={onToggleSubtask}
              onAddSubtask={onAddSubtask}
              onClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
