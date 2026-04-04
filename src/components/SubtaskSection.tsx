"use client";

import { CheckCircle2, Circle, Plus } from "lucide-react";
import { TaskWithSubtasks } from "@/types/task";
import { useLang } from "@/context/LanguageContext";

interface Props {
  task: TaskWithSubtasks;
  onAddSubtask: () => void;
  onDrillDown: (sub: TaskWithSubtasks) => void;
}

export default function SubtaskSection({ task, onAddSubtask, onDrillDown }: Props) {
  const { t } = useLang();

  return (
    <div className="border-t border-surface-border pt-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">
          {t('subtasks')} ({task.subtasks.length})
        </h3>
        <button
          onClick={onAddSubtask}
          className="text-brand-600 dark:text-brand-400 flex items-center gap-1 text-sm font-medium hover:underline"
        >
          <Plus size={16} /> {t('add_subtask')}
        </button>
      </div>

      <div className="space-y-2">
        {task.subtasks.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t('no_subtasks')}</p>
        )}
        {task.subtasks.map(sub => (
          <div
            key={sub.id}
            onClick={() => onDrillDown(sub)}
            className="flex justify-between items-center p-3 rounded-lg border border-surface-border bg-surface-hover/50 hover:bg-surface-hover cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              {sub.status === 'DONE' ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : (
                <Circle size={18} className="text-slate-400" />
              )}
              <span className={`font-medium ${sub.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                {sub.title}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Est: {sub.total_effort}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
