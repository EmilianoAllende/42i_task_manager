"use client";

import { TaskWithSubtasks } from "@/types/task";
import { Draggable } from "@hello-pangea/dnd";
import { CheckCircle2, Circle, Flag } from "lucide-react";

interface Props {
  task: TaskWithSubtasks;
  index: number;
  onClick: (task: TaskWithSubtasks) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT': return 'text-red-500 bg-red-500/10';
    case 'HIGH': return 'text-orange-500 bg-orange-500/10';
    case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10';
    case 'LOW': return 'text-blue-500 bg-blue-500/10';
    default: return 'text-slate-500 bg-slate-500/10';
  }
};

export default function TaskCard({ task, index, onClick }: Props) {
  // We only show root tasks on the board as cards, subtasks are shown inside the detail view
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`
            p-4 mb-3 rounded-xl border transition-all cursor-pointer
            ${snapshot.isDragging 
              ? 'border-brand-500 shadow-xl bg-surface scale-[1.02] rotate-1 z-50' 
              : 'border-surface-border bg-surface hover:border-brand-300 hover:shadow-md'
            }
          `}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start mb-2 gap-2">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
              {task.title}
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3 text-xs font-medium">
            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
              <Flag size={12} />
              {task.priority}
            </span>
            
            {task.total_effort > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                Effort: {task.completed_effort} / {task.total_effort}
              </span>
            )}

            {task.subtasks.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                {task.completed_effort === task.total_effort && task.total_effort > 0 ? (
                  <CheckCircle2 size={12} className="text-green-500" />
                ) : (
                  <Circle size={12} />
                )}
                {task.subtasks.length} Subtasks
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
