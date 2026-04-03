"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Task, TaskWithSubtasks, TaskStatus } from "@/types/task";
import { buildTaskTree } from "@/utils/taskHelpers";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { showToast } from "nextjs-toast-notify";
import TaskCard from "./TaskCard";
import TaskDetailModal from "./TaskDetailModal";
import { useLang } from "@/context/LanguageContext";

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function TaskBoard() {
  const { user } = useAuth();
  const { t } = useLang();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tree, setTree] = useState<TaskWithSubtasks[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTask, setSelectedTask] = useState<TaskWithSubtasks | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?userId=${user?.id}`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
        setTree(buildTaskTree(data.tasks));
      } else {
        showToast.error(t('failed_load'));
      }
    } catch (err) {
      showToast.error(t('network_error'));
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;

    // Optimistic UI update
    const updatedTasks = tasks.map(t => t.id === draggableId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    setTree(buildTaskTree(updatedTasks));

    // Persist
    try {
      const res = await fetch(`/api/tasks/${draggableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      showToast.error("Failed to update task status");
      fetchTasks(); // Revert on failure
    }
  };

  const openTaskModal = (task?: TaskWithSubtasks) => {
    setSelectedTask(task || null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
          {t('board_title')}
        </h1>
        <button 
          onClick={() => openTaskModal()}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
        >
          + {t('add_task')}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
          {COLUMNS.map((colId) => {
            const columnTasks = tree.filter(t => t.status === colId);
            return (
              <div key={colId} className="min-w-[320px] w-80 shrink-0 flex flex-col bg-surface-hover/50 dark:bg-surface-hover border border-surface-border rounded-2xl overflow-hidden glass-panel">
                <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface/50">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t(colId)}</h3>
                  <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 text-xs py-1 px-2.5 rounded-full font-bold">
                    {columnTasks.length}
                  </span>
                </div>
                
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                    >
                      {columnTasks.map((task, index) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          index={index} 
                          onClick={openTaskModal} 
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => {
            setIsModalOpen(false);
            fetchTasks();
          }} 
        />
      )}
    </div>
  );
}
