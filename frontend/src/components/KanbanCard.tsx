import React, { useState } from 'react';
import type { Issue, IssueStatus } from '../types';
import { 
  Bookmark, 
  Bug, 
  CheckSquare, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Circle
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
  onAddSubtask: _onAddSubtask,
  onClick,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);

  const completedSubtasks = issue.subtasks?.filter((st) => st.isCompleted).length || 0;
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

  // Jira semantic issue type icon
  const renderTypeIcon = () => {
    switch (issue.issueType) {
      case 'BUG':
        return <Bug className="w-3.5 h-3.5 text-[#E5493A] fill-[#E5493A]/10 shrink-0" />;
      case 'TASK':
        return <CheckSquare className="w-3.5 h-3.5 text-[#0065FF] fill-[#0065FF]/10 shrink-0" />;
      case 'STORY':
      default:
        return <Bookmark className="w-3.5 h-3.5 text-[#36B37E] fill-[#36B37E]/20 shrink-0" />;
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
      className="group bg-white dark:bg-[#2C333A] hover:bg-[#FAFBFC] dark:hover:bg-[#323940] border border-[#DFE1E6] dark:border-[#38414A] rounded p-2.5 shadow-[0_1px_1px_rgba(9,30,66,0.25)] dark:shadow-[0_1px_1px_rgba(0,0,0,0.5)] transition-all cursor-pointer select-none relative"
    >
      {/* 1. Issue Title (Jira 13px medium, #172B4D) */}
      <div className="text-[13px] font-medium text-[#172B4D] dark:text-[#DEE4EA] leading-tight line-clamp-2 mb-2">
        {issue.title}
      </div>

      {/* 2. Epic Lozenge (Jira Style: [Phase 1] Authentication & JWT... ⌄) */}
      {issue.epicTitle && (
        <div className="mb-2">
          <span 
            className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded border max-w-full truncate"
            style={{
              borderColor: `${issue.epicColor || '#6554C0'}50`,
              backgroundColor: `${issue.epicColor || '#6554C0'}15`,
              color: issue.epicColor || '#6554C0',
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-xs shrink-0"
              style={{ backgroundColor: issue.epicColor || '#6554C0' }}
            />
            <span className="truncate">{issue.epicTitle}</span>
          </span>
        </div>
      )}

      {/* 3. Subtask Checklist Summary (if any) */}
      {totalSubtasks > 0 && (
        <div 
          className="mb-2 pt-1 border-t border-[#EBECF0] dark:border-[#38414A]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center justify-between w-full text-[11px] text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA]"
          >
            <div className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-[#5E6C84] dark:text-[#8C9BAB]" />
              <span>{completedSubtasks}/{totalSubtasks} tasks</span>
            </div>
            <div className="w-14 bg-[#EBECF0] dark:bg-[#1D2125] h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#36B37E] h-full"
                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              />
            </div>
          </button>

          {showSubtasks && (
            <div className="mt-1.5 space-y-1 pl-1">
              {issue.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(st.id, !st.isCompleted, st.title)}
                  className="flex items-center gap-1.5 text-[11px] cursor-pointer text-[#42526E] dark:text-[#DEE4EA]"
                >
                  {st.isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-[#36B37E] shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-[#8993A4] shrink-0" />
                  )}
                  <span className={st.isCompleted ? 'line-through text-[#8993A4]' : ''}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Bottom Metadata Row (Type Icon, Key, Quick Nav, Points, Avatar) */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#EBECF0] dark:border-[#38414A] text-[11px]">
        {/* Left: Type Icon + Issue Key */}
        <div className="flex items-center gap-1.5">
          {renderTypeIcon()}
          <span className="font-mono text-[11px] font-semibold text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#0052CC] dark:hover:text-[#579DFF] hover:underline">
            {issue.key}
          </span>
        </div>

        {/* Right: Quick Move chevrons (Mobile & Desktop), Points Box, Avatar */}
        <div className="flex items-center gap-1.5">
          {/* Quick Column Shift (Jira / Rally style mobile helper) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            {canMovePrev && (
              <button
                onClick={handlePrev}
                title="Move to previous column"
                className="p-0.5 text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-white rounded"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            )}
            {canMoveNext && (
              <button
                onClick={handleNext}
                title="Advance to next column"
                className="p-0.5 text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-white rounded"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Rally / Jira Story Points Badge */}
          {issue.storyPoints !== null && issue.storyPoints !== undefined && (
            <div 
              className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#EBECF0] dark:bg-[#1D2125] text-[#42526E] dark:text-[#DEE4EA] font-mono text-[10px] font-bold flex items-center justify-center border border-[#DFE1E6] dark:border-[#38414A]"
              title={`${issue.storyPoints} Story Points`}
            >
              {issue.storyPoints}
            </div>
          )}

          {/* Assignee Avatar Circle (Matches Jira screenshot!) */}
          <div 
            className="w-5 h-5 rounded-full bg-[#0052CC] text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
            title="Assigned to Satyam"
          >
            S
          </div>

          {/* Delete Icon on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(issue.id);
            }}
            title="Delete issue"
            className="opacity-0 group-hover:opacity-100 p-0.5 text-[#8993A4] hover:text-[#DE350B] rounded transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
