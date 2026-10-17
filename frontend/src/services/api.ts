import type { Project, Epic, Issue, CreateIssueDto, IssueStatus, Sprint, UpdateIssueDto } from '../types';

const API_BASE = '/api';

export const api = {
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(key: string, name: string, description?: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, name, description }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create workspace');
    }
    return res.json();
  },

  async getEpics(projectId: string): Promise<Epic[]> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/epics`);
    if (!res.ok) throw new Error('Failed to fetch epics');
    return res.json();
  },

  async createEpic(projectId: string, title: string, color: string, status: string): Promise<Epic> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/epics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, color, status }),
    });
    if (!res.ok) throw new Error('Failed to create epic');
    return res.json();
  },

  async getIssues(projectId: string): Promise<Issue[]> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/issues`);
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
  },

  async createIssue(projectId: string, dto: CreateIssueDto): Promise<Issue> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to create issue');
    return res.json();
  },

  async updateIssue(issueId: string, dto: UpdateIssueDto): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues/${issueId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to update issue');
    return res.json();
  },

  async updateIssueStatus(issueId: string, status: IssueStatus, rank?: number): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues/${issueId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rank }),
    });
    if (!res.ok) throw new Error('Failed to update issue status');
    return res.json();
  },

  async deleteIssue(issueId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/issues/${issueId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete issue');
  },

  async getSprints(projectId: string): Promise<Sprint[]> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/sprints`);
    if (!res.ok) throw new Error('Failed to fetch sprints');
    return res.json();
  },

  async getActiveSprint(projectId: string): Promise<Sprint | null> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/sprints/active`);
    if (res.status === 204) return null;
    if (!res.ok) throw new Error('Failed to fetch active sprint');
    return res.json();
  },

  async createSprint(projectId: string, name: string, goal?: string, startDate?: string, endDate?: string): Promise<Sprint> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/sprints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, goal, startDate, endDate, state: 'PLANNED' }),
    });
    if (!res.ok) throw new Error('Failed to create sprint');
    return res.json();
  },

  async startSprint(sprintId: string): Promise<Sprint> {
    const res = await fetch(`${API_BASE}/sprints/${sprintId}/start`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to start sprint');
    return res.json();
  },

  async completeSprint(sprintId: string): Promise<Sprint> {
    const res = await fetch(`${API_BASE}/sprints/${sprintId}/complete`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to complete sprint');
    return res.json();
  },

  async deleteSprint(sprintId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/sprints/${sprintId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete sprint');
  },

  async addSubTask(issueId: string, title: string): Promise<void> {
    const res = await fetch(`${API_BASE}/issues/${issueId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, isCompleted: false, orderIndex: 0 }),
    });
    if (!res.ok) throw new Error('Failed to add subtask');
  },

  async updateSubTask(subTaskId: string, title: string, isCompleted: boolean, orderIndex: number = 0): Promise<void> {
    const res = await fetch(`${API_BASE}/subtasks/${subTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, isCompleted, orderIndex }),
    });
    if (!res.ok) throw new Error('Failed to update subtask');
  },

  async deleteSubTask(subTaskId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/subtasks/${subTaskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete subtask');
  }
};
