export type IssueType = 'STORY' | 'BUG' | 'TASK';
export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type EpicStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Epic {
  id: string;
  projectId: string;
  key: string;
  title: string;
  color: string;
  status: EpicStatus;
  issueCount?: number;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  orderIndex: number;
}

export interface Issue {
  id: string;
  projectId: string;
  projectKey: string;
  epicId?: string | null;
  epicKey?: string | null;
  epicTitle?: string | null;
  epicColor?: string | null;
  sprintId?: string | null;
  key: string;
  title: string;
  description?: string;
  issueType: IssueType;
  status: IssueStatus;
  storyPoints?: number | null;
  rank: number;
  createdAt?: string;
  updatedAt?: string;
  subtasks: SubTask[];
}

export interface CreateIssueDto {
  title: string;
  description?: string;
  issueType: IssueType;
  epicId?: string;
  sprintId?: string;
  storyPoints?: number;
}

export type SprintState = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal?: string;
  state: SprintState;
  startDate?: string;
  endDate?: string;
  issueCount?: number;
  totalStoryPoints?: number;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  issueType?: IssueType;
  status?: IssueStatus;
  epicId?: string | null;
  sprintId?: string | null;
  storyPoints?: number | null;
  rank?: number;
}
