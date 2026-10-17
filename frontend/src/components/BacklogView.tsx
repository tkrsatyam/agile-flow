import React, { useState } from 'react';
import type { Issue, Sprint, Epic, IssueStatus } from '../types';
import { 
  Bookmark, 
  Bug, 
  CheckSquare, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  MoreHorizontal,
  Calendar
} from 'lucide-react';

interface BacklogViewProps {
  sprint: Sprint | null;
  issues: Issue[];
  epics: Epic[];
  onOpenCreateModal: (defaultStatus: IssueStatus) => void;
  onOpenDetailModal: (issue: Issue) => void;
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
  onCompleteSprint?: () => void;
  onStartSprint?: () => void;
  onCreateSprint?: () => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({
  sprint,
  issues,
  epics: _epics,
  onOpenCreateModal,
  onOpenDetailModal,
  onStatusChange,
  onCompleteSprint,
  onStartSprint,
  onCreateSprint,
}) => {
  const [isSprintExpanded, setIsSprintExpanded] = useState(true);
  const [isBacklogExpanded, setIsBacklogExpanded] = useState(true);

  // Issues in the sprint vs issues in general backlog
  const sprintIssues = sprint ? issues.filter((i) => i.sprintId === sprint.id || i.status !== 'DONE') : [];
  const backlogIssues = sprint ? issues.filter((i) => i.sprintId !== sprint.id && i.status === 'TODO') : issues;

  // Calculate Points (Todo: gray, In Progress: blue, Done: green)
  const sprintTodoPts = sprintIssues.filter((i) => i.status === 'TODO').reduce((s, i) => s + (i.storyPoints || 0), 0);
  const sprintProgPts = sprintIssues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'REVIEW').reduce((s, i) => s + (i.storyPoints || 0), 0);
  const sprintDonePts = sprintIssues.filter((i) => i.status === 'DONE').reduce((s, i) => s + (i.storyPoints || 0), 0);

  const backlogTodoPts = backlogIssues.reduce((s, i) => s + (i.storyPoints || 0), 0);

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'BUG':
        return <Bug className="w-3.5 h-3.5 text-[#E5493A] fill-[#E5493A]/10 shrink-0" />;
      case 'TASK':
        return <CheckSquare className="w-3.5 h-3.5 text-[#0065FF] fill-[#0065FF]/10 shrink-0" />;
      case 'STORY':
      default:
        return <Bookmark className="w-3.5 h-3.5 text-[#36B37E] fill-[#36B37E]/20 shrink-0" />;
    }
  };

  const renderStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="bg-[#DEEBFF] text-[#0052CC] dark:bg-[#1D2B41] dark:text-[#579DFF] px-1.5 py-0.5 rounded text-[11px] font-semibold">IN PROGRESS</span>;
      case 'REVIEW':
        return <span className="bg-[#FFF0B3] text-[#172B4D] dark:bg-[#332E1B] dark:text-[#F5CD47] px-1.5 py-0.5 rounded text-[11px] font-semibold">IN REVIEW</span>;
      case 'DONE':
        return <span className="bg-[#E3FCEF] text-[#006644] dark:bg-[#1C3329] dark:text-[#7EE2B8] px-1.5 py-0.5 rounded text-[11px] font-semibold">DONE</span>;
      case 'TODO':
      default:
        return <span className="bg-[#DFE1E6] text-[#42526E] dark:bg-[#2C333A] dark:text-[#8C9BAB] px-1.5 py-0.5 rounded text-[11px] font-semibold">TO DO</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. SPRINT CONTAINER (Jira Style) */}
      <div className="bg-white dark:bg-[#1D2125] border border-[#DFE1E6] dark:border-[#2C333A] rounded">
        {/* Sprint Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#FAFBFC] dark:bg-[#22272B] border-b border-[#DFE1E6] dark:border-[#2C333A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSprintExpanded(!isSprintExpanded)}
              className="p-1 text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded"
            >
              {isSprintExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-[#172B4D] dark:text-[#DEE4EA]">
                {sprint?.name || 'Sprint 1'}
              </span>
              <span className="text-xs text-[#5E6C84] dark:text-[#8C9BAB] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Active Iteration</span>
              </span>
              <span className="text-xs text-[#5E6C84] dark:text-[#8C9BAB]">
                ({sprintIssues.length} work items)
              </span>
            </div>
          </div>

          {/* Right Header Actions: Points lozenges + Sprint Control */}
          <div className="flex items-center gap-2">
            {/* 3 Points Lozenges (Jira: Gray=Todo, Blue=Prog, Green=Done) */}
            <div className="flex items-center gap-1 font-mono text-xs font-bold">
              <span className="px-1.5 py-0.5 rounded-full bg-[#DFE1E6] dark:bg-[#2C333A] text-[#42526E] dark:text-[#8C9BAB]">
                {sprintTodoPts}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#DEEBFF] dark:bg-[#1D2B41] text-[#0052CC] dark:text-[#579DFF]">
                {sprintProgPts}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#E3FCEF] dark:bg-[#1C3329] text-[#006644] dark:text-[#7EE2B8]">
                {sprintDonePts}
              </span>
            </div>

            {sprint?.state === 'ACTIVE' ? (
              <button
                onClick={onCompleteSprint}
                className="px-2.5 py-1 text-xs font-semibold bg-[#EBECF0] dark:bg-[#2C333A] hover:bg-[#DFE1E6] text-[#172B4D] dark:text-[#DEE4EA] rounded border border-[#DFE1E6] dark:border-[#38414A] transition-colors"
              >
                Complete sprint
              </button>
            ) : (
              <button
                onClick={onStartSprint}
                className="px-2.5 py-1 text-xs font-semibold bg-[#0052CC] hover:bg-[#0747A6] text-white rounded transition-colors"
              >
                Start sprint
              </button>
            )}

            <button className="p-1 text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sprint Issue Rows */}
        {isSprintExpanded && (
          <div className="divide-y divide-[#EBECF0] dark:divide-[#2C333A]">
            {sprintIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => onOpenDetailModal(issue)}
                className="flex items-center justify-between px-4 py-2 hover:bg-[#FAFBFC] dark:hover:bg-[#22272B] cursor-pointer group transition-colors text-xs"
              >
                {/* Left: Type, Key, Title */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
                  <input
                    type="checkbox"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-[#DFE1E6] text-[#0052CC] focus:ring-0"
                  />
                  {renderTypeIcon(issue.issueType)}
                  <span className="font-mono font-semibold text-[#5E6C84] dark:text-[#8C9BAB] shrink-0">
                    {issue.key}
                  </span>
                  <span className="text-[#172B4D] dark:text-[#DEE4EA] font-medium truncate">
                    {issue.title}
                  </span>
                </div>

                {/* Right: Epic Pill, Status Dropdown, Points, Avatar */}
                <div className="flex items-center gap-3 shrink-0">
                  {issue.epicTitle && (
                    <span 
                      className="text-[10px] font-medium px-2 py-0.5 rounded border hidden sm:inline-block max-w-[140px] truncate"
                      style={{
                        borderColor: `${issue.epicColor || '#6554C0'}50`,
                        backgroundColor: `${issue.epicColor || '#6554C0'}15`,
                        color: issue.epicColor || '#6554C0',
                      }}
                    >
                      {issue.epicTitle}
                    </span>
                  )}

                  {/* Status Dropdown */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <select
                      value={issue.status}
                      onChange={(e) => onStatusChange(issue.id, e.target.value as IssueStatus)}
                      className="bg-transparent border-0 text-xs font-semibold focus:ring-0 cursor-pointer p-0"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">In Review</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>

                  {/* Story Points */}
                  <span className="min-w-[18px] text-center font-mono font-bold text-[#5E6C84] dark:text-[#8C9BAB]">
                    {issue.storyPoints ?? '-'}
                  </span>

                  {/* Avatar */}
                  <div className="w-5 h-5 rounded-full bg-[#0052CC] text-white font-bold text-[10px] flex items-center justify-center">
                    S
                  </div>
                </div>
              </div>
            ))}

            {/* + Create Inline under Sprint */}
            <div className="px-4 py-2 bg-[#FAFBFC] dark:bg-[#1D2125]">
              <button
                onClick={() => onOpenCreateModal('TODO')}
                className="text-xs font-medium text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#0052CC] dark:hover:text-[#579DFF] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create issue</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. BACKLOG CONTAINER (Jira Style) */}
      <div className="bg-white dark:bg-[#1D2125] border border-[#DFE1E6] dark:border-[#2C333A] rounded">
        {/* Backlog Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#FAFBFC] dark:bg-[#22272B] border-b border-[#DFE1E6] dark:border-[#2C333A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBacklogExpanded(!isBacklogExpanded)}
              className="p-1 text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded"
            >
              {isBacklogExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#172B4D] dark:text-[#DEE4EA]">
                Backlog
              </span>
              <span className="text-xs text-[#5E6C84] dark:text-[#8C9BAB]">
                ({backlogIssues.length} work items)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-full bg-[#DFE1E6] dark:bg-[#2C333A] text-[#42526E] dark:text-[#8C9BAB] font-mono text-xs font-bold">
              {backlogTodoPts}
            </span>

            <button
              onClick={onCreateSprint}
              className="px-2.5 py-1 text-xs font-semibold bg-[#EBECF0] dark:bg-[#2C333A] hover:bg-[#DFE1E6] text-[#172B4D] dark:text-[#DEE4EA] rounded border border-[#DFE1E6] dark:border-[#38414A] transition-colors"
            >
              Create sprint
            </button>
          </div>
        </div>

        {/* Backlog List */}
        {isBacklogExpanded && (
          <div className="divide-y divide-[#EBECF0] dark:divide-[#2C333A]">
            {backlogIssues.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5E6C84] dark:text-[#8C9BAB]">
                Your backlog is empty. Click "+ Create issue" below to plan new stories or bugs.
              </div>
            ) : (
              backlogIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onOpenDetailModal(issue)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-[#FAFBFC] dark:hover:bg-[#22272B] cursor-pointer group transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-[#DFE1E6] text-[#0052CC] focus:ring-0"
                    />
                    {renderTypeIcon(issue.issueType)}
                    <span className="font-mono font-semibold text-[#5E6C84] dark:text-[#8C9BAB] shrink-0">
                      {issue.key}
                    </span>
                    <span className="text-[#172B4D] dark:text-[#DEE4EA] font-medium truncate">
                      {issue.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {issue.epicTitle && (
                      <span 
                        className="text-[10px] font-medium px-2 py-0.5 rounded border hidden sm:inline-block max-w-[140px] truncate"
                        style={{
                          borderColor: `${issue.epicColor || '#6554C0'}50`,
                          backgroundColor: `${issue.epicColor || '#6554C0'}15`,
                          color: issue.epicColor || '#6554C0',
                        }}
                      >
                        {issue.epicTitle}
                      </span>
                    )}

                    {renderStatusBadge(issue.status)}

                    <span className="min-w-[18px] text-center font-mono font-bold text-[#5E6C84] dark:text-[#8C9BAB]">
                      {issue.storyPoints ?? '-'}
                    </span>

                    <div className="w-5 h-5 rounded-full bg-[#0052CC] text-white font-bold text-[10px] flex items-center justify-center">
                      S
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* + Create Inline under Backlog */}
            <div className="px-4 py-2 bg-[#FAFBFC] dark:bg-[#1D2125]">
              <button
                onClick={() => onOpenCreateModal('TODO')}
                className="text-xs font-medium text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#0052CC] dark:hover:text-[#579DFF] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create issue</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
