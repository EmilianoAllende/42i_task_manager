import { describe, it, expect } from 'vitest';
import { buildTaskTree } from './taskHelpers';
import { Task } from '@/types/task';

describe('buildTaskTree', () => {
  it('should build a tree of tasks with correct subtask linkage', () => {
    const tasks: Task[] = [
      { id: '1', user_id: 1, title: 'Task 1', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 2, parent_task_id: null, created_at: '' },
      { id: '2', user_id: 1, title: 'Task 1.1', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 3, parent_task_id: '1', created_at: '' },
      { id: '3', user_id: 1, title: 'Task 2', description: '', status: 'DONE', priority: 'LOW', effort_estimate: 5, parent_task_id: null, created_at: '' },
    ];

    const tree = buildTaskTree(tasks);

    expect(tree.length).toBe(2);
    const root1 = tree.find(t => t.id === '1')!;
    const root2 = tree.find(t => t.id === '3')!;

    expect(root1.subtasks.length).toBe(1);
    expect(root1.subtasks[0].id).toBe('2');
    
    // root1 total effort: 2 (own) + 3 (subtask) = 5
    expect(root1.total_effort).toBe(5);
    // root1 completed effort: 0 (not done) + 0 (subtask not done) = 0
    expect(root1.completed_effort).toBe(0);

    expect(root2.subtasks.length).toBe(0);
    expect(root2.total_effort).toBe(5);
    // root2 is DONE: completed_effort = 5
    expect(root2.completed_effort).toBe(5);
  });

  it('should calculate deep nested tree effort correctly', () => {
    const tasks: Task[] = [
      { id: '1', user_id: 1, title: 'R', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 10, parent_task_id: null, created_at: '' },
      { id: '2', user_id: 1, title: 'R.1', description: '', status: 'IN_PROGRESS', priority: 'MEDIUM', effort_estimate: 5, parent_task_id: '1', created_at: '' },
      { id: '3', user_id: 1, title: 'R.1.1', description: '', status: 'DONE', priority: 'LOW', effort_estimate: 2, parent_task_id: '2', created_at: '' },
    ];

    const tree = buildTaskTree(tasks);
    
    expect(tree.length).toBe(1);
    const r = tree[0];
    
    expect(r.total_effort).toBe(17); // 10 + 5 + 2
    expect(r.completed_effort).toBe(2); // Only R.1.1 is DONE
    
    const r1 = r.subtasks[0];
    expect(r1.total_effort).toBe(7); // 5 + 2
    expect(r1.completed_effort).toBe(2);
  });

  it('should return empty array for empty task list', () => {
    const tree = buildTaskTree([]);
    expect(tree).toHaveLength(0);
  });

  it('should treat tasks with unknown parent_task_id as root tasks', () => {
    const tasks: Task[] = [
      { id: 'orphan', user_id: 1, title: 'Orphan', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 7, parent_task_id: 'does-not-exist', created_at: '' },
    ];

    const tree = buildTaskTree(tasks);

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('orphan');
    expect(tree[0].total_effort).toBe(7);
  });

  it('should sum completed_effort from multiple done children', () => {
    const tasks: Task[] = [
      { id: 'p', user_id: 1, title: 'Parent', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 1, parent_task_id: null, created_at: '' },
      { id: 'c1', user_id: 1, title: 'Child 1', description: '', status: 'DONE', priority: 'MEDIUM', effort_estimate: 4, parent_task_id: 'p', created_at: '' },
      { id: 'c2', user_id: 1, title: 'Child 2', description: '', status: 'DONE', priority: 'MEDIUM', effort_estimate: 6, parent_task_id: 'p', created_at: '' },
      { id: 'c3', user_id: 1, title: 'Child 3', description: '', status: 'TODO', priority: 'MEDIUM', effort_estimate: 2, parent_task_id: 'p', created_at: '' },
    ];

    const tree = buildTaskTree(tasks);

    expect(tree[0].total_effort).toBe(13);    // 1+4+6+2
    expect(tree[0].completed_effort).toBe(10); // c1(4) + c2(6), parent not done
  });
});
