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
      className={`flex flex-col flex-1 min-w-[270px] max-w-[360px] bg-[#F4F5F7] dark:bg-[#1D2125] rounded border transition-colors ${
        isDragOver
          ? 'border-[#0052CC] dark:border-[#579DFF] bg-[#DEEBFF]/30 dark:bg-[#22272B]'
          : 'border-[#EBECF0] dark:border-[#2C333A]'
      }`}
    >
      {/* Jira Column Header (e.g. "To Do 1") */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5E6C84] dark:text-[#8C9BAB]">
            {title}
          </h3>
          <span className="text-xs font-semibold text-[#5E6C84] dark:text-[#8C9BAB]">
            {issues.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {totalPoints > 0 && (
            <span 
              className="text-[10px] font-mono font-bold text-[#5E6C84] dark:text-[#8C9BAB] bg-[#EBECF0] dark:bg-[#22272B] px-1.5 py-0.5 rounded border border-[#DFE1E6] dark:border-[#2C333A]"
              title={`${totalPoints} story points in this column`}
            >
              {totalPoints} pts
            </span>
          )}
          <button
            onClick={() => onOpenCreateModal(status)}
            className="p-1 rounded text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] transition-colors"
            title={`Create issue in ${title}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto max-h-[calc(100vh-230px)] min-h-[350px]">
        {issues.map((issue) => (
          <KanbanCard
            key={issue.id}
            issue={issue}
            onStatusChange={onStatusChange}
            onDelete={onDeleteIssue}
            onToggleSubtask={onToggleSubtask}
            onAddSubtask={onAddSubtask}
            onClick={onCardClick}
          />
        ))}

        {/* Inline Quick Add Button at bottom of column */}
        <button
          onClick={() => onOpenCreateModal(status)}
          className="w-full py-1.5 px-2 rounded hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] text-left text-xs text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA] flex items-center gap-1 transition-colors group"
        >
          <Plus className="w-3.5 h-3.5 text-[#5E6C84] dark:text-[#8C9BAB] group-hover:text-[#0052CC] dark:group-hover:text-[#579DFF]" />
          <span>Create</span>
        </button>
      </div>
    </div>
  );
};
