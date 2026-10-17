import { useState, useEffect } from 'react';
import type { Project, Epic, Issue, IssueStatus, CreateIssueDto, EpicStatus, Sprint, UpdateIssueDto } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { MobileTabBar } from './components/MobileTabBar';
import { KanbanColumn } from './components/KanbanColumn';
import { CreateIssueModal } from './components/CreateIssueModal';
import { WorkspaceModal } from './components/WorkspaceModal';
import { CreateEpicModal } from './components/CreateEpicModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { Layers, CheckCircle2, Clock, Plus, Zap } from 'lucide-react';

const COLUMNS: { status: IssueStatus; title: string; color: string }[] = [
  { status: 'TODO', title: 'To Do', color: '#94A3B8' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: '#38BDF8' },
  { status: 'REVIEW', title: 'In Review', color: '#F59E0B' },
  { status: 'DONE', title: 'Done', color: '#10B981' },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'demo-proj-1',
    key: 'FLOW',
    name: 'AgileFlow MVP',
    description: 'Lightweight, touch-friendly Agile project management workspace.',
  },
];

const INITIAL_EPICS: Epic[] = [
  {
    id: 'epic-1',
    projectId: 'demo-proj-1',
    key: 'FLOW-E1',
    title: 'Kanban Experience',
    color: '#3B82F6',
    status: 'IN_PROGRESS',
    issueCount: 2,
  },
  {
    id: 'epic-2',
    projectId: 'demo-proj-1',
    key: 'FLOW-E2',
    title: 'Mobile Touch Polish',
    color: '#10B981',
    status: 'OPEN',
    issueCount: 1,
  },
];

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    projectId: 'demo-proj-1',
    projectKey: 'FLOW',
    epicId: 'epic-2',
    epicKey: 'FLOW-E2',
    epicTitle: 'Mobile Touch Polish',
    epicColor: '#10B981',
    key: 'FLOW-1',
    title: 'Implement single-column swipe gestures on phone viewports',
    description: 'Ensure users on screens < 768px can swipe horizontally between To Do, In Progress, Review, and Done.',
    issueType: 'STORY',
    status: 'TODO',
    storyPoints: 5,
    rank: 1,
    subtasks: [
      { id: 'st-1', title: 'Detect touch start & touch end coordinates', isCompleted: true, orderIndex: 0 },
      { id: 'st-2', title: 'Animate active column transition', isCompleted: false, orderIndex: 1 },
    ],
  },
  {
    id: 'issue-2',
    projectId: 'demo-proj-1',
    projectKey: 'FLOW',
    epicId: 'epic-1',
    epicKey: 'FLOW-E1',
    epicTitle: 'Kanban Experience',
    epicColor: '#3B82F6',
    key: 'FLOW-2',
    title: 'Smooth 60 FPS drag-and-drop card interaction',
    description: 'Integrate touch-aware DnD with instant optimistic state update and visual drag preview.',
    issueType: 'STORY',
    status: 'IN_PROGRESS',
    storyPoints: 3,
    rank: 1,
    subtasks: [
      { id: 'st-3', title: 'Wire up drag event handlers', isCompleted: true, orderIndex: 0 },
      { id: 'st-4', title: 'Add column drop highlight styling', isCompleted: true, orderIndex: 1 },
    ],
  },
  {
    id: 'issue-3',
    projectId: 'demo-proj-1',
    projectKey: 'FLOW',
    epicId: 'epic-1',
    epicKey: 'FLOW-E1',
    epicTitle: 'Kanban Experience',
    epicColor: '#3B82F6',
    key: 'FLOW-3',
    title: 'Fix Fibonacci story point badge clipping on narrow cards',
    description: 'Badge numbers 8 and 13 overflow card margin on viewport widths below 380px.',
    issueType: 'BUG',
    status: 'REVIEW',
    storyPoints: 2,
    rank: 1,
    subtasks: [],
  },
  {
    id: 'issue-4',
    projectId: 'demo-proj-1',
    projectKey: 'FLOW',
    epicId: 'epic-1',
    epicKey: 'FLOW-E1',
    epicTitle: 'Kanban Experience',
    epicColor: '#3B82F6',
    key: 'FLOW-4',
    title: 'Set up Spring Boot 4 + Java 25 backend REST endpoints',
    description: 'Initialize Project, Epic, Issue, and SubTask domain services and OpenAPI docs.',
    issueType: 'TASK',
    status: 'DONE',
    storyPoints: 3,
    rank: 1,
    subtasks: [
      { id: 'st-5', title: 'Define JPA Entities & Repositories', isCompleted: true, orderIndex: 0 },
      { id: 'st-6', title: 'Configure Springdoc OpenAPI 3.0', isCompleted: true, orderIndex: 1 },
    ],
  },
];

export function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [epics, setEpics] = useState<Epic[]>(INITIAL_EPICS);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [activeMobileStatus, setActiveMobileStatus] = useState<IssueStatus>('TODO');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<IssueStatus>('TODO');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Detect screen size on load
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
      // Local fallback filter
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

  // Handle Drag / Quick Move Status Update
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
      sprintId: dto.sprintId || null,
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
        const created = await api.createIssue(currentProject.id, dto);
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

  // Compute status counts & story point tallies
  const columnCounts = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = issues.filter((i) => i.status === col.status).length;
      return acc;
    },
    {} as Record<IssueStatus, number>
  );

  const totalPoints = issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const donePoints = issues
    .filter((i) => i.status === 'DONE')
    .reduce((sum, i) => sum + (i.storyPoints || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Main Navbar */}
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
      />

      {/* Mobile Top Status Tabs (<768px or Mobile simulation mode) */}
      {viewMode === 'mobile' && (
        <MobileTabBar
          activeStatus={activeMobileStatus}
          onSelectStatus={setActiveMobileStatus}
          columnCounts={columnCounts}
        />
      )}

      {/* Subheader: Board Quick Stats & Epics Bar */}
      <div className="border-b border-slate-900 bg-slate-900/40 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {activeSprint && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">{activeSprint.name}</span>
                <span className="text-[10px] text-indigo-400/80">({activeSprint.state})</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{issues.length} Issues</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{totalPoints} Total Story Points</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{donePoints} Points Completed</span>
            </div>
          </div>

          {/* Epics Badges Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Epics:
            </span>
            {epics.map((epic) => (
              <span
                key={epic.id}
                className="text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 whitespace-nowrap"
                style={{
                  borderColor: `${epic.color}40`,
                  backgroundColor: `${epic.color}15`,
                  color: epic.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: epic.color }}
                />
                <span className="font-medium">{epic.title}</span>
              </span>
            ))}

            <button
              onClick={() => setIsEpicModalOpen(true)}
              className="text-xs px-2 py-0.5 rounded-full border border-dashed border-slate-700 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 flex items-center gap-1 transition-colors"
              title="Add Epic"
            >
              <Plus className="w-3 h-3" />
              <span>New Epic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-hidden">
        {viewMode === 'mobile' ? (
          /* Mobile Single-Column Focused View */
          <div className="h-full flex flex-col max-w-md mx-auto">
            {COLUMNS.filter((col) => col.status === activeMobileStatus).map((col) => (
              <KanbanColumn
                key={col.status}
                status={col.status}
                title={col.title}
                color={col.color}
                issues={issues.filter((i) => i.status === col.status)}
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
          /* Desktop 4-Column Board */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full items-start">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                status={col.status}
                title={col.title}
                color={col.color}
                issues={issues.filter((i) => i.status === col.status)}
                onStatusChange={handleStatusChange}
                onDeleteIssue={handleDeleteIssue}
                onToggleSubtask={handleToggleSubtask}
                onAddSubtask={handleAddSubtask}
                onOpenCreateModal={handleOpenCreateModal}
                onCardClick={handleOpenDetailModal}
              />
            ))}
          </div>
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
