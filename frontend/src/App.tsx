import { useState, useEffect, useMemo } from 'react';
import type { Project, Epic, Issue, IssueStatus, CreateIssueDto, EpicStatus, Sprint, UpdateIssueDto } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { MobileTabBar } from './components/MobileTabBar';
import { KanbanColumn } from './components/KanbanColumn';
import { BacklogView } from './components/BacklogView';
import { CreateIssueModal } from './components/CreateIssueModal';
import { WorkspaceModal } from './components/WorkspaceModal';
import { CreateEpicModal } from './components/CreateEpicModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { 
  Kanban, 
  ListTodo, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Share2, 
  Plus, 
  Users
} from 'lucide-react';

const COLUMNS: { status: IssueStatus; title: string; color: string }[] = [
  { status: 'TODO', title: 'To Do', color: '#42526E' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: '#0052CC' },
  { status: 'REVIEW', title: 'In Review', color: '#F59E0B' },
  { status: 'DONE', title: 'Done', color: '#36B37E' },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'demo-proj-1',
    key: 'ORDM',
    name: 'Orbit Delivery Management',
    description: 'Autonomous delivery fleet coordination and dispatch system.',
  },
];

const INITIAL_EPICS: Epic[] = [
  {
    id: 'epic-1',
    projectId: 'demo-proj-1',
    key: 'ORDM-E1',
    title: '[Phase 1] Authentication & JWT Security',
    color: '#6554C0',
    status: 'IN_PROGRESS',
    issueCount: 3,
  },
  {
    id: 'epic-2',
    projectId: 'demo-proj-1',
    key: 'ORDM-E2',
    title: '[Phase 1] Frontend Routes & UX',
    color: '#0052CC',
    status: 'OPEN',
    issueCount: 2,
  },
];

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    projectId: 'demo-proj-1',
    projectKey: 'ORDM',
    epicId: 'epic-1',
    epicKey: 'ORDM-E1',
    epicTitle: '[Phase 1] Authentication & JWT...',
    epicColor: '#6554C0',
    key: 'ORDM-26',
    title: 'User Registration & Login with Email/Password',
    description: 'Implement secure registration, BCrypt password hashing, and token issue.',
    issueType: 'STORY',
    status: 'TODO',
    storyPoints: 5,
    rank: 1,
    subtasks: [
      { id: 'st-1', title: 'Validate email format and unique constraints', isCompleted: true, orderIndex: 0 },
      { id: 'st-2', title: 'Return JWT and user payload on 201', isCompleted: false, orderIndex: 1 },
    ],
  },
  {
    id: 'issue-2',
    projectId: 'demo-proj-1',
    projectKey: 'ORDM',
    epicId: 'epic-1',
    epicKey: 'ORDM-E1',
    epicTitle: '[Phase 1] Authentication & JWT...',
    epicColor: '#6554C0',
    key: 'ORDM-27',
    title: 'JWT Issuance, Refresh Cookie & Rotation',
    description: 'Ensure silent token rotation via httpOnly secure cookie.',
    issueType: 'STORY',
    status: 'IN_PROGRESS',
    storyPoints: 3,
    rank: 1,
    subtasks: [
      { id: 'st-3', title: 'Configure Refresh Token Repository', isCompleted: true, orderIndex: 0 },
    ],
  },
  {
    id: 'issue-3',
    projectId: 'demo-proj-1',
    projectKey: 'ORDM',
    epicId: 'epic-2',
    epicKey: 'ORDM-E2',
    epicTitle: '[Phase 1] Frontend Routes...',
    epicColor: '#0052CC',
    key: 'ORDM-28',
    title: 'Frontend Protected Routes & AuthContext',
    description: 'Provide React auth wrapper and redirect unauthenticated routes to /login.',
    issueType: 'STORY',
    status: 'TODO',
    storyPoints: 3,
    rank: 2,
    subtasks: [],
  },
  {
    id: 'issue-4',
    projectId: 'demo-proj-1',
    projectKey: 'ORDM',
    epicId: 'epic-1',
    epicKey: 'ORDM-E1',
    epicTitle: '[Phase 1] Authentication & JWT...',
    epicColor: '#6554C0',
    key: 'ORDM-29',
    title: 'Logout with Token Invalidation',
    description: 'Add token denylist or purge refresh token from DB on logout.',
    issueType: 'STORY',
    status: 'TODO',
    storyPoints: 2,
    rank: 3,
    subtasks: [],
  },
  {
    id: 'issue-5',
    projectId: 'demo-proj-1',
    projectKey: 'ORDM',
    epicId: 'epic-1',
    epicKey: 'ORDM-E1',
    epicTitle: '[Phase 1] Authentication & JWT...',
    epicColor: '#6554C0',
    key: 'ORDM-30',
    title: 'Shared Backend Request Infrastructure — Rate Limiting & Global Exception Handling',
    description: 'Standardize RFC 7807 problem details response for all 4xx and 5xx API errors.',
    issueType: 'TASK',
    status: 'TODO',
    storyPoints: 5,
    rank: 4,
    subtasks: [],
  },
];

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('agileflow_theme') as 'light' | 'dark') || 'light';
  });

  const [activeTab, setActiveTab] = useState<'board' | 'backlog'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnlyMine, setFilterOnlyMine] = useState(false);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [epics, setEpics] = useState<Epic[]>(INITIAL_EPICS);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [activeMobileStatus, setActiveMobileStatus] = useState<IssueStatus>('TODO');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<IssueStatus>('TODO');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Sync Theme with HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('agileflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Detect mobile screen width on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('mobile');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync projects with Backend API
  useEffect(() => {
    async function loadInitialData() {
      try {
        const fetchedProjects = await api.getProjects();
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
          const first = fetchedProjects[0];
          setCurrentProject(first);

          const [backendEpics, backendIssues, sprint] = await Promise.all([
            api.getEpics(first.id),
            api.getIssues(first.id),
            api.getActiveSprint(first.id).catch(() => null),
          ]);

          setEpics(backendEpics);
          setIssues(backendIssues);
          setActiveSprint(sprint);
          setIsBackendConnected(true);
        }
      } catch (err) {
        console.warn('Backend API not reachable; operating in local sandbox mode', err);
        setIsBackendConnected(false);
      }
    }

    loadInitialData();
  }, []);

  // Switch Active Workspace
  const handleSelectProject = async (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;

    setCurrentProject(found);

    if (isBackendConnected) {
      try {
        const [backendEpics, backendIssues, sprint] = await Promise.all([
          api.getEpics(found.id),
          api.getIssues(found.id),
          api.getActiveSprint(found.id).catch(() => null),
        ]);
        setEpics(backendEpics);
        setIssues(backendIssues);
        setActiveSprint(sprint);
      } catch (err) {
        console.error('Failed to load project data', err);
      }
    } else {
      setEpics(INITIAL_EPICS.filter((e) => e.projectId === found.id));
      setIssues(INITIAL_ISSUES.filter((i) => i.projectId === found.id));
      setActiveSprint(null);
    }
  };

  // Create Workspace
  const handleCreateProject = async (key: string, name: string, description?: string) => {
    if (isBackendConnected) {
      const created = await api.createProject(key, name, description);
      setProjects((prev) => [...prev, created]);
      setCurrentProject(created);
      setEpics([]);
      setIssues([]);
    } else {
      const newProj: Project = {
        id: `local-proj-${Date.now()}`,
        key,
        name,
        description,
        createdAt: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProj]);
      setCurrentProject(newProj);
      setEpics([]);
      setIssues([]);
    }
  };

  // Create Epic
  const handleCreateEpic = async (title: string, color: string, status: EpicStatus) => {
    if (isBackendConnected) {
      try {
        const created = await api.createEpic(currentProject.id, title, color, status);
        setEpics((prev) => [...prev, created]);
      } catch (err) {
        console.error('Failed to create epic on backend', err);
      }
    } else {
      const newEpic: Epic = {
        id: `local-epic-${Date.now()}`,
        projectId: currentProject.id,
        key: `${currentProject.key}-E${epics.length + 1}`,
        title,
        color,
        status,
        issueCount: 0,
      };
      setEpics((prev) => [...prev, newEpic]);
    }
  };

  // Handle Drag / Move Status Update
  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === issueId ? { ...item, status: newStatus } : item
      )
    );

    if (isBackendConnected) {
      try {
        await api.updateIssueStatus(issueId, newStatus);
      } catch (err) {
        console.error('Failed to sync status update to backend', err);
      }
    }
  };

  // Handle Create Issue
  const handleCreateIssue = async (dto: CreateIssueDto, initialStatus: IssueStatus = 'TODO') => {
    const epic = epics.find((e) => e.id === dto.epicId);
    const newKey = `${currentProject.key}-${issues.length + 1}`;

    const tempIssue: Issue = {
      id: `local-${Date.now()}`,
      projectId: currentProject.id,
      projectKey: currentProject.key,
      epicId: dto.epicId || null,
      epicKey: epic ? epic.key : null,
      epicTitle: epic ? epic.title : null,
      epicColor: epic ? epic.color : null,
      sprintId: activeSprint?.id || null,
      key: newKey,
      title: dto.title,
      description: dto.description,
      issueType: dto.issueType,
      status: initialStatus,
      storyPoints: dto.storyPoints || null,
      rank: issues.length + 1,
      subtasks: [],
    };

    setIssues((prev) => [...prev, tempIssue]);

    if (isBackendConnected) {
      try {
        const created = await api.createIssue(currentProject.id, {
          ...dto,
          sprintId: activeSprint?.id,
        });
        if (initialStatus !== 'TODO') {
          await api.updateIssueStatus(created.id, initialStatus);
        }
        setIssues((prev) =>
          prev.map((item) => (item.id === tempIssue.id ? created : item))
        );
      } catch (err) {
        console.error('Failed to create issue in backend', err);
      }
    }
  };

  // Handle Delete Issue
  const handleDeleteIssue = async (issueId: string) => {
    setIssues((prev) => prev.filter((item) => item.id !== issueId));

    if (isBackendConnected) {
      try {
        await api.deleteIssue(issueId);
      } catch (err) {
        console.error('Failed to delete issue on backend', err);
      }
    }
  };

  // Handle Subtask Toggle
  const handleToggleSubtask = async (subtaskId: string, completed: boolean, title: string) => {
    setIssues((prev) =>
      prev.map((issue) => ({
        ...issue,
        subtasks: issue.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, isCompleted: completed } : st
        ),
      }))
    );

    if (isBackendConnected) {
      try {
        await api.updateSubTask(subtaskId, title, completed);
      } catch (err) {
        console.error('Failed to update subtask on backend', err);
      }
    }
  };

  // Handle Add Subtask
  const handleAddSubtask = async (issueId: string, title: string) => {
    const newSubtask = {
      id: `st-${Date.now()}`,
      title,
      isCompleted: false,
      orderIndex: 0,
    };

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? { ...issue, subtasks: [...issue.subtasks, newSubtask] }
          : issue
      )
    );

    if (isBackendConnected) {
      try {
        await api.addSubTask(issueId, title);
      } catch (err) {
        console.error('Failed to add subtask on backend', err);
      }
    }
  };

  const handleOpenCreateModal = (defaultStatus: IssueStatus = 'TODO') => {
    setCreateModalDefaultStatus(defaultStatus);
    setIsCreateModalOpen(true);
  };

  const handleOpenDetailModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleUpdateIssue = async (issueId: string, dto: UpdateIssueDto) => {
    const epic = epics.find((e) => e.id === dto.epicId);

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== issueId) return item;
        return {
          ...item,
          title: dto.title ?? item.title,
          description: dto.description ?? item.description,
          issueType: dto.issueType ?? item.issueType,
          status: dto.status ?? item.status,
          storyPoints: dto.storyPoints !== undefined ? dto.storyPoints : item.storyPoints,
          epicId: dto.epicId !== undefined ? dto.epicId : item.epicId,
          epicTitle: epic ? epic.title : (dto.epicId === null ? null : item.epicTitle),
          epicColor: epic ? epic.color : (dto.epicId === null ? null : item.epicColor),
          epicKey: epic ? epic.key : (dto.epicId === null ? null : item.epicKey),
        };
      })
    );

    if (isBackendConnected) {
      try {
        const updated = await api.updateIssue(issueId, dto);
        setIssues((prev) => prev.map((item) => (item.id === issueId ? updated : item)));
      } catch (err) {
        console.error('Failed to update issue on backend', err);
      }
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    setIssues((prev) =>
      prev.map((issue) => ({
        ...issue,
        subtasks: issue.subtasks.filter((st) => st.id !== subtaskId),
      }))
    );

    if (isBackendConnected) {
      try {
        await api.deleteSubTask(subtaskId);
      } catch (err) {
        console.error('Failed to delete subtask on backend', err);
      }
    }
  };

  // Complete Sprint Handler
  const handleCompleteSprint = async () => {
    if (!activeSprint) return;
    if (window.confirm(`Complete ${activeSprint.name}?`)) {
      if (isBackendConnected) {
        await api.completeSprint(activeSprint.id);
        setActiveSprint(null);
      } else {
        setActiveSprint(null);
      }
    }
  };

  // Create Sprint Handler
  const handleCreateSprint = async () => {
    if (isBackendConnected) {
      const created = await api.createSprint(
        currentProject.id,
        `${currentProject.key} Sprint 2`,
        'Next delivery iteration'
      );
      setActiveSprint(created);
    } else {
      const mockSprint: Sprint = {
        id: `sprint-${Date.now()}`,
        projectId: currentProject.id,
        name: `${currentProject.key} Sprint 2`,
        state: 'PLANNED',
      };
      setActiveSprint(mockSprint);
    }
  };

  // Filtered issues based on search & assignee filter
  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      const matchesSearch = searchQuery === '' || 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.key.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [issues, searchQuery]);

  const columnCounts = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = filteredIssues.filter((i) => i.status === col.status).length;
      return acc;
    },
    {} as Record<IssueStatus, number>
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#161A1D] text-[#172B4D] dark:text-[#DEE4EA] flex flex-col font-sans transition-colors">
      {/* 1. Atlassian Global Navigation Bar */}
      <Navbar
        currentProject={currentProject}
        onOpenCreateModal={() => handleOpenCreateModal('TODO')}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
        onOpenEpicModal={() => setIsEpicModalOpen(true)}
        isBackendConnected={isBackendConnected}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((prev) => (prev === 'desktop' ? 'mobile' : 'desktop'))
        }
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Jira Project Header & Breadcrumbs (from Image 1) */}
      <div className="bg-white dark:bg-[#1D2125] border-b border-[#DFE1E6] dark:border-[#2C333A] px-4 sm:px-6 pt-3 transition-colors">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb: Spaces */}
          <div className="text-[11px] text-[#5E6C84] dark:text-[#8C9BAB] font-medium mb-1">
            Spaces
          </div>

          {/* Project Title Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-[#FFAB00] text-[#172B4D] font-bold text-xs flex items-center justify-center shadow-xs">
                {currentProject?.key?.[0] || 'O'}
              </div>
              <h1 className="text-lg font-bold text-[#172B4D] dark:text-[#DEE4EA] tracking-tight">
                {currentProject?.name || 'Orbit Delivery Management'}
              </h1>
              <span className="p-1 text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded cursor-pointer">
                <Users className="w-4 h-4" />
              </span>
              <button 
                onClick={() => setIsWorkspaceModalOpen(true)}
                className="p-1 text-[#5E6C84] dark:text-[#8C9BAB] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Share / Export icons */}
            <div className="flex items-center gap-2 text-[#5E6C84] dark:text-[#8C9BAB]">
              <button className="p-1.5 hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] rounded transition-colors" title="Share Project">
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsEpicModalOpen(true)}
                className="text-xs px-2.5 py-1 rounded border border-[#DFE1E6] dark:border-[#38414A] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] text-[#172B4D] dark:text-[#DEE4EA] font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Epic</span>
              </button>
            </div>
          </div>

          {/* Jira Navigation Tabs (Board, Backlog, Timeline, Reports) */}
          <div className="flex items-center gap-6 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('board')}
              className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'board'
                  ? 'border-[#0052CC] dark:border-[#579DFF] text-[#0052CC] dark:text-[#579DFF]'
                  : 'border-transparent text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Board</span>
            </button>

            <button
              onClick={() => setActiveTab('backlog')}
              className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'backlog'
                  ? 'border-[#0052CC] dark:border-[#579DFF] text-[#0052CC] dark:text-[#579DFF]'
                  : 'border-transparent text-[#5E6C84] dark:text-[#8C9BAB] hover:text-[#172B4D] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>Backlog</span>
            </button>

            <span className="pb-2.5 text-[#8993A4] dark:text-[#626F86] cursor-not-allowed whitespace-nowrap">
              Summary
            </span>
            <span className="pb-2.5 text-[#8993A4] dark:text-[#626F86] cursor-not-allowed whitespace-nowrap">
              Timeline
            </span>
            <span className="pb-2.5 text-[#8993A4] dark:text-[#626F86] cursor-not-allowed whitespace-nowrap">
              Reports
            </span>
          </div>
        </div>
      </div>

      {/* 3. Jira Filter Bar (from Image 1 & 3) */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#FAFBFC] dark:bg-[#1D2125] border-b border-[#DFE1E6] dark:border-[#2C333A] transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Search + Quick Filter Avatars + Filter Button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Board input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5E6C84] dark:text-[#8C9BAB]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'board' ? 'Search board' : 'Search backlog'}
                className="bg-white dark:bg-[#22272B] border border-[#DFE1E6] dark:border-[#38414A] rounded pl-8 pr-3 py-1 text-xs text-[#172B4D] dark:text-[#DEE4EA] placeholder-[#5E6C84] dark:placeholder-[#8C9BAB] focus:outline-none focus:ring-1 focus:ring-[#0052CC] w-40 sm:w-56"
              />
            </div>

            {/* Quick Avatar Filter: 'S' */}
            <button
              onClick={() => setFilterOnlyMine(!filterOnlyMine)}
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                filterOnlyMine
                  ? 'bg-[#0052CC] text-white ring-2 ring-[#0052CC] ring-offset-1'
                  : 'bg-[#0052CC] text-white hover:opacity-90'
              }`}
              title="Filter by assigned to Satyam"
            >
              S
            </button>

            {/* Filter Dropdown Button */}
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded border border-[#DFE1E6] dark:border-[#38414A] bg-white dark:bg-[#22272B] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] text-[#172B4D] dark:text-[#DEE4EA] transition-colors">
              <Filter className="w-3.5 h-3.5 text-[#5E6C84] dark:text-[#8C9BAB]" />
              <span>Filter</span>
            </button>

            {/* Group: Assignee Pill (Jira Style) */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-[#0052CC]/40 bg-[#DEEBFF]/50 dark:bg-[#1D2B41] text-[#0052CC] dark:text-[#579DFF]">
              <span>Group: Assignee</span>
            </div>
          </div>

          {/* Right: Complete sprint button (Jira solid blue) */}
          <div className="flex items-center gap-2">
            {activeSprint && (
              <button
                onClick={handleCompleteSprint}
                className="flex items-center gap-1.5 bg-[#0052CC] hover:bg-[#0747A6] dark:bg-[#579DFF] dark:hover:bg-[#85B8FF] text-white dark:text-[#161A1D] px-3 py-1 rounded text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Complete sprint</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Top Tabs (Single Column mode) */}
      {viewMode === 'mobile' && activeTab === 'board' && (
        <MobileTabBar
          activeStatus={activeMobileStatus}
          onSelectStatus={setActiveMobileStatus}
          columnCounts={columnCounts}
        />
      )}

      {/* 4. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-hidden">
        {activeTab === 'backlog' ? (
          /* JIRA BACKLOG VIEW (from Image 3) */
          <BacklogView
            sprint={activeSprint}
            issues={filteredIssues}
            epics={epics}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenDetailModal={handleOpenDetailModal}
            onStatusChange={handleStatusChange}
            onCompleteSprint={handleCompleteSprint}
            onCreateSprint={handleCreateSprint}
          />
        ) : (
          /* JIRA KANBAN BOARD VIEW (from Image 1 & 2) */
          viewMode === 'mobile' ? (
            /* Mobile Single-Column Carousel */
            <div className="h-full flex flex-col max-w-md mx-auto">
              {COLUMNS.filter((col) => col.status === activeMobileStatus).map((col) => (
                <KanbanColumn
                  key={col.status}
                  status={col.status}
                  title={col.title}
                  color={col.color}
                  issues={filteredIssues.filter((i) => i.status === col.status)}
                  onStatusChange={handleStatusChange}
                  onDeleteIssue={handleDeleteIssue}
                  onToggleSubtask={handleToggleSubtask}
                  onAddSubtask={handleAddSubtask}
                  onOpenCreateModal={handleOpenCreateModal}
                  onCardClick={handleOpenDetailModal}
                />
              ))}
            </div>
          ) : (
            /* Desktop Multi-Column Kanban Board */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 h-full items-start">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.status}
                  status={col.status}
                  title={col.title}
                  color={col.color}
                  issues={filteredIssues.filter((i) => i.status === col.status)}
                  onStatusChange={handleStatusChange}
                  onDeleteIssue={handleDeleteIssue}
                  onToggleSubtask={handleToggleSubtask}
                  onAddSubtask={handleAddSubtask}
                  onOpenCreateModal={handleOpenCreateModal}
                  onCardClick={handleOpenDetailModal}
                />
              ))}
            </div>
          )
        )}
      </main>

      {/* Fast Issue Creation Modal */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIssue}
        epics={epics}
        defaultStatus={createModalDefaultStatus}
      />

      {/* Workspace Switcher & Creator Modal */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        projects={projects}
        currentProjectId={currentProject.id}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
      />

      {/* Epic Creation Modal */}
      <CreateEpicModal
        isOpen={isEpicModalOpen}
        onClose={() => setIsEpicModalOpen(false)}
        onSubmit={handleCreateEpic}
        projectKey={currentProject.key}
      />

      {/* Issue Detail & Edit Modal */}
      <IssueDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIssue(null);
        }}
        issue={selectedIssue}
        epics={epics}
        onUpdateIssue={handleUpdateIssue}
        onDeleteIssue={handleDeleteIssue}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={handleAddSubtask}
        onDeleteSubtask={handleDeleteSubtask}
      />
    </div>
  );
}

export default App;
