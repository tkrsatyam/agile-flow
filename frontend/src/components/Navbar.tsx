import React from 'react';
import type { Project } from '../types';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  ChevronDown, 
  Moon, 
  Sun, 
  Bell, 
  HelpCircle,
  Smartphone,
  Monitor
} from 'lucide-react';

interface NavbarProps {
  currentProject: Project | null;
  onOpenCreateModal: () => void;
  onOpenWorkspaceModal: () => void;
  onOpenEpicModal: () => void;
  isBackendConnected: boolean;
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  onOpenCreateModal,
  onOpenWorkspaceModal,
  isBackendConnected,
  viewMode,
  onToggleViewMode,
  theme,
  onToggleTheme,
  searchQuery = '',
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1D2125] border-b border-[#DFE1E6] dark:border-[#2C333A] px-3 sm:px-5 py-1.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Atlassian App Grid + Logo + Spaces Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* App Switcher 9-dots */}
          <button 
            className="p-1.5 text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors"
            title="Atlassian Apps"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* AgileFlow Brand (Jira Style) */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={onOpenWorkspaceModal}>
            <div className="w-5 h-5 bg-[#0052CC] rounded flex items-center justify-center text-white font-bold text-xs shadow-xs">
              A
            </div>
            <span className="font-bold text-sm text-[#172B4D] dark:text-[#DEE4EA] tracking-tight hidden sm:inline">
              AgileFlow
            </span>
            <span 
              className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-[#36B37E]' : 'bg-[#FFAB00]'}`} 
              title={isBackendConnected ? 'Backend Connected' : 'Offline / Local Cache'} 
            />
          </div>

          <span className="text-[#C1C7D0] dark:text-[#3B444C] hidden sm:inline">|</span>

          {/* Workspace Dropdown (Spaces / Project in Jira) */}
          <button
            onClick={onOpenWorkspaceModal}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] text-left transition-colors group"
            title="Switch project workspace"
          >
            {/* Project Icon (Jira yellow-orange or blue badge) */}
            <div className="w-4 h-4 rounded bg-[#FFAB00] text-[#172B4D] font-bold text-[10px] flex items-center justify-center shadow-xs">
              {currentProject?.key?.[0] || 'O'}
            </div>
            <span className="text-xs font-semibold text-[#172B4D] dark:text-[#DEE4EA] max-w-[130px] sm:max-w-[200px] truncate">
              {currentProject?.name || 'Orbit Delivery Management'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#5E6C84] dark:text-[#8C9BAB]" />
          </button>
        </div>

        {/* Center: Global Search Bar (Jira Style) */}
        <div className="flex-1 max-w-xs sm:max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5E6C84] dark:text-[#8C9BAB]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#F4F5F7] dark:bg-[#22272B] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] focus:bg-white dark:focus:bg-[#22272B] border border-[#DFE1E6] dark:border-[#2C333A] focus:border-[#0052CC] dark:focus:border-[#579DFF] rounded pl-8 pr-7 py-1 text-xs text-[#172B4D] dark:text-[#DEE4EA] placeholder-[#5E6C84] dark:placeholder-[#8C9BAB] focus:outline-none focus:ring-1 focus:ring-[#0052CC] transition-all"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8993A4] dark:text-[#626F86] bg-white dark:bg-[#1D2125] px-1 rounded border border-[#DFE1E6] dark:border-[#2C333A]">
              /
            </kbd>
          </div>
        </div>

        {/* Right Section: + Create Button, Theme Toggle, Mobile Switcher, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Solid Blue Create Button (Jira Iconic) */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 bg-[#0052CC] hover:bg-[#0747A6] dark:bg-[#579DFF] dark:hover:bg-[#85B8FF] text-white dark:text-[#161A1D] px-2.5 sm:px-3 py-1 rounded text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors"
            title={theme === 'light' ? 'Switch to Dark theme' : 'Switch to Light theme'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#5E6C84]" />
            ) : (
              <Sun className="w-4 h-4 text-[#F5CD47]" />
            )}
          </button>

          {/* View Mode Toggle (Mobile / Desktop) */}
          <button
            onClick={onToggleViewMode}
            className="p-1.5 text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors hidden sm:inline-flex"
            title={`Switch to ${viewMode === 'desktop' ? 'Mobile Focus' : 'Desktop'}`}
          >
            {viewMode === 'desktop' ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4 text-[#0052CC] dark:text-[#579DFF]" />
            )}
          </button>

          {/* Notifications */}
          <button 
            className="p-1.5 text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors hidden sm:block"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Help */}
          <button 
            className="p-1.5 text-[#42526E] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors hidden sm:block"
            title="Help & Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile Avatar (Blue circle with letter 'S') */}
          <div 
            className="w-6 h-6 rounded-full bg-[#0052CC] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-[#4C9AFF] transition-all"
            title="Satyam (satyamk.1107@gmail.com)"
          >
            S
          </div>
        </div>
      </div>
    </header>
  );
};
