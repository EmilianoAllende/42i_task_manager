import { Task, TaskWithSubtasks } from '@/types/task';

export function buildTaskTree(tasks: Task[]): TaskWithSubtasks[] {
  const taskMap = new Map<string, TaskWithSubtasks>();
  const rootTasks: TaskWithSubtasks[] = [];

  // Initialize map
  for (const task of tasks) {
    taskMap.set(task.id, { 
      ...task, 
      subtasks: [], 
      total_effort: task.effort_estimate || 0, 
      completed_effort: 0 
    });
  }

  // Build tree connections
  for (const task of tasks) {
    if (task.parent_task_id) {
      const parent = taskMap.get(task.parent_task_id);
      if (parent) {
        parent.subtasks.push(taskMap.get(task.id)!);
      } else {
        // Orphan task treated as root
        rootTasks.push(taskMap.get(task.id)!);
      }
    } else {
      rootTasks.push(taskMap.get(task.id)!);
    }
  }

  // Post-order traversal to calculate aggregate effort
  function calculateEffort(node: TaskWithSubtasks) {
    let subTotal = 0;
    let subCompleted = 0;
    
    for (const child of node.subtasks) {
      calculateEffort(child);
      subTotal += child.total_effort;
      subCompleted += child.completed_effort;
    }
    
    node.total_effort = (node.effort_estimate || 0) + subTotal;
    
    const myCompleted = node.status === 'DONE' ? (node.effort_estimate || 0) : 0;
    node.completed_effort = myCompleted + subCompleted;
  }

  for (const root of rootTasks) {
    calculateEffort(root);
  }

  return rootTasks;
}
