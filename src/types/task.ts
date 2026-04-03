export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  effort_estimate: number;
  parent_task_id: string | null;
  created_at: string;
}

export interface TaskWithSubtasks extends Task {
  subtasks: TaskWithSubtasks[];
  total_effort: number;
  completed_effort: number;
}
