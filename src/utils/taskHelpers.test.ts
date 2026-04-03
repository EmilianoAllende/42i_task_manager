import { describe, it, expect } from 'vitest';
import { buildTaskTree } from './taskHelpers';
import { Task } from '@/types/task';

describe('buildTaskTree', () => {
  it('should build a tree of tasks', () => {
    const tasks: Task[] = [
      { id: '1', user_id: 'u1', title: 'Task 1', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 2, parent_task_id: null, created_at: '' },
      { id: '2', user_id: 'u1', title: 'Task 1.1', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 3, parent_task_id: '1', created_at: '' },
      { id: '3', user_id: 'u1', title: 'Task 2', description: '', status: 'DONE', priority: 'LOW', effort_estimate: 5, parent_task_id: null, created_at: '' },
    ];

    const tree = buildTaskTree(tasks);

    expect(tree.length).toBe(2);
    const root1 = tree.find(t => t.id === '1')!;
    const root2 = tree.find(t => t.id === '3')!;

    expect(root1.subtasks.length).toBe(1);
    expect(root1.subtasks[0].id).toBe('2');
    
    // Effort aggregations
    // root1 total effort: 2 (own) + 3 (subtask) = 5
    expect(root1.total_effort).toBe(5);
    // root1 completed effort: 0 (not done yet) + 0 (subtask not done) = 0
    expect(root1.completed_effort).toBe(0);

    expect(root2.subtasks.length).toBe(0);
    // root2 effort: 5
    expect(root2.total_effort).toBe(5);
    // root2 is DONE, completed effort: 5
    expect(root2.completed_effort).toBe(5);
  });

  it('should calculate deep nested tree effort', () => {
    const tasks: Task[] = [
      { id: '1', user_id: 'u1', title: 'R', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 10, parent_task_id: null, created_at: '' },
      { id: '2', user_id: 'u1', title: 'R.1', description: '', status: 'IN_PROGRESS', priority: 'MEDIUM', effort_estimate: 5, parent_task_id: '1', created_at: '' },
      { id: '3', user_id: 'u1', title: 'R.1.1', description: '', status: 'DONE', priority: 'LOW', effort_estimate: 2, parent_task_id: '2', created_at: '' },
    ];

    const tree = buildTaskTree(tasks);
    
    expect(tree.length).toBe(1);
    const r = tree[0];
    
    expect(r.total_effort).toBe(17); // 10 + 5 + 2
    expect(r.completed_effort).toBe(2); // Only R.1.1 is done, R is not done, R.1 is IN_PROGRESS
    
    const r1 = r.subtasks[0];
    expect(r1.total_effort).toBe(7); // 5 + 2
    expect(r1.completed_effort).toBe(2);
  });
});
