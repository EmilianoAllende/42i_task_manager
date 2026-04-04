"use client";

import { useState, useEffect } from "react";
import { TaskWithSubtasks, TaskStatus, TaskPriority } from "@/types/task";
import { Attachment } from "@/types/attachment";
import { X, Save } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import DeleteConfirmOverlay from "./DeleteConfirmOverlay";
import AttachmentSection from "./AttachmentSection";
import SubtaskSection from "./SubtaskSection";

interface Props {
  task: TaskWithSubtasks | null; // null means create new, otherwise edit
  initialParentId?: string; // used when creating a subtask
  onClose: () => void;
}

export default function TaskDetailModal({ task, initialParentId, onClose }: Props) {
  const { user } = useAuth();
  const { t } = useLang();
  
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "TODO");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "MEDIUM");
  const [effortEstimate, setEffortEstimate] = useState<number>(task?.effort_estimate || 0);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  // Drill down Navigation
  const [drillDownTask, setDrillDownTask] = useState<TaskWithSubtasks | null>(null);
  const [isCreatingSubtask, setIsCreatingSubtask] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setEffortEstimate(task.effort_estimate);
      fetchAttachments(task.id);
    }
  }, [task]);

  const fetchAttachments = async (taskId: string) => {
    try {
      const res = await fetch(`/api/attachments?taskId=${taskId}`);
      const data = await res.json();
      if (res.ok) setAttachments(data.attachments);
    } catch {}
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !task || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', task.id);
      formData.append('userId', String(user.id));

      const res = await fetch('/api/attachments', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      setAttachments(prev => [...prev, data.attachment]);
      showToast.success('File uploaded!', { position: 'top-right' });
    } catch (err: any) {
      showToast.error(t('upload_failed'), { position: 'top-right' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      const res = await fetch(`/api/attachments/${attachmentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
      showToast.success(t('delete_attachment'), { position: 'top-right' });
    } catch {
      showToast.error('Failed to remove attachment', { position: 'top-right' });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showToast.error("Title is required");
      return;
    }
    setLoading(true);

    const payload = {
      title,
      description,
      status,
      priority,
      effort_estimate: Number(effortEstimate),
      user_id: user?.id,
      parent_task_id: task ? task.parent_task_id : (initialParentId || null),
    };

    try {
      const url = task ? `/api/tasks/${task.id}` : `/api/tasks`;
      const method = task ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Save failed");
      showToast.success(t('save'), { position: "top-right" });
      onClose();
    } catch (err) {
      showToast.error("Failed to save task", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!task) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      showToast.success(t('delete'), { position: "top-right" });
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      showToast.error("Failed to delete task", { position: "top-right" });
    } finally {
      setDeleting(false);
    }
  };

  if (drillDownTask) {
    return <TaskDetailModal task={drillDownTask} onClose={() => { setDrillDownTask(null); onClose() }} />;
  }

  if (isCreatingSubtask && task) {
    return <TaskDetailModal task={null} initialParentId={task.id} onClose={() => { setIsCreatingSubtask(false); onClose() }} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-surface-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {showDeleteConfirm && (
          <DeleteConfirmOverlay
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={confirmDelete}
            deleting={deleting}
          />
        )}

        {/* Header */}
        <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface-hover/30">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {task ? t('edit_task') : t('new_task')}
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('task_title_label')}</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-lg rounded-lg border border-surface-border bg-surface outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium" 
              placeholder={t('task_title_placeholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('status')}</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface outline-none focus:border-brand-500"
              >
                <option value="TODO">{t('TODO')}</option>
                <option value="IN_PROGRESS">{t('IN_PROGRESS')}</option>
                <option value="DONE">{t('DONE')}</option>
              </select>
            </div>
            
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('priority')}</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface outline-none focus:border-brand-500"
              >
                <option value="LOW">{t('LOW')}</option>
                <option value="MEDIUM">{t('MEDIUM')}</option>
                <option value="HIGH">{t('HIGH')}</option>
                <option value="URGENT">{t('URGENT')}</option>
              </select>
            </div>

            {/* Effort */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('effort_label')}</label>
              <input 
                type="number" 
                min={0}
                value={effortEstimate} 
                onChange={e => setEffortEstimate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Aggregated Estimations (Only on Edit) */}
          {task && (
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-4 border border-brand-100 dark:border-brand-800/30">
              <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-2">{t('aggregated')}</h4>
              <div className="flex gap-6 text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-500 dark:text-slate-400">{t('total_effort')}</span>
                  <span className="font-medium text-lg">{task.total_effort}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 dark:text-slate-400">{t('completed')}</span>
                  <span className="font-medium text-lg text-green-600 dark:text-green-400">{task.completed_effort}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 dark:text-slate-400">{t('remaining')}</span>
                  <span className="font-medium text-lg text-orange-600 dark:text-orange-400">{task.total_effort - task.completed_effort}</span>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('description')}</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-surface-border bg-surface outline-none focus:ring-2 focus:ring-brand-500 resize-none" 
              placeholder={t('description_placeholder')}
            />
          </div>

          {task && (
            <AttachmentSection
              attachments={attachments}
              uploading={uploading}
              onUpload={handleFileUpload}
              onDelete={handleDeleteAttachment}
            />
          )}

          {task && (
            <SubtaskSection
              task={task}
              onAddSubtask={() => setIsCreatingSubtask(true)}
              onDrillDown={setDrillDownTask}
            />
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-border bg-surface-hover/30 flex justify-between items-center">
          {task ? (
             <button 
               onClick={() => setShowDeleteConfirm(true)}
               className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
             >
               {t('delete')}
             </button>
          ) : <div />}
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
              {t('cancel')}
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} /> {loading ? t('saving') : t('save')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
