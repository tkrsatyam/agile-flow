import React from 'react';
import type { IssueStatus } from '../types';

interface MobileTabBarProps {
  activeStatus: IssueStatus;
  onSelectStatus: (status: IssueStatus) => void;
  columnCounts: Record<IssueStatus, number>;
}

const TABS: { status: IssueStatus; label: string }[] = [
  { status: 'TODO', label: 'To Do' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'REVIEW', label: 'In Review' },
  { status: 'DONE', label: 'Done' },
];

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeStatus,
  onSelectStatus,
  columnCounts,
}) => {
  return (
    <div className="md:hidden sticky top-[49px] z-30 bg-white dark:bg-[#1D2125] border-b border-[#DFE1E6] dark:border-[#2C333A] px-2 flex items-center overflow-x-auto text-xs transition-colors">
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.status;
        const count = columnCounts[tab.status] || 0;

        return (
          <button
            key={tab.status}
            onClick={() => onSelectStatus(tab.status)}
            className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-semibold whitespace-nowrap transition-colors flex-1 justify-center ${
              isActive
                ? 'border-[#0052CC] text-[#0052CC] dark:border-[#579DFF] dark:text-[#579DFF]'
                : 'border-transparent text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                isActive
                  ? 'bg-[#DEEBFF] text-[#0052CC] dark:bg-[#1D2B41] dark:text-[#579DFF]'
                  : 'bg-[#EBECF0] text-[#5E6C84] dark:bg-[#2C333A] dark:text-[#8C9BAB]'
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
