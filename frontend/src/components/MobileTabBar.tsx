import React from 'react';
import type { IssueStatus } from '../types';

interface MobileTabBarProps {
  activeStatus: IssueStatus;
  onSelectStatus: (status: IssueStatus) => void;
  columnCounts: Record<IssueStatus, number>;
}

const TABS: { status: IssueStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To Do', color: '#94A3B8' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: '#38BDF8' },
  { status: 'REVIEW', label: 'Review', color: '#F59E0B' },
  { status: 'DONE', label: 'Done', color: '#10B981' },
];

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeStatus,
  onSelectStatus,
  columnCounts,
}) => {
  return (
    <div className="md:hidden sticky top-[65px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.status;
        const count = columnCounts[tab.status] || 0;

        return (
          <button
            key={tab.status}
            onClick={() => onSelectStatus(tab.status)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              isActive
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80 ring-1 ring-slate-600/30'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tab.color }}
            />
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-indigo-600/40 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
