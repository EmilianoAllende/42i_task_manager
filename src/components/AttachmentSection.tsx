"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { Attachment } from "@/types/attachment";
import { useLang } from "@/context/LanguageContext";
import AttachmentPreview from "./AttachmentPreview";

interface Props {
  attachments: Attachment[];
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
}

export default function AttachmentSection({ attachments, uploading, onUpload, onDelete }: Props) {
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-t border-surface-border pt-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Paperclip size={16} /> {t('attachments')} ({attachments.length})
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-brand-600 dark:text-brand-400 flex items-center gap-1 text-sm font-medium hover:underline disabled:opacity-50"
        >
          {uploading ? t('uploading') : `+ ${t('add_attachment')}`}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onUpload}
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
        />
      </div>

      {attachments.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t('no_attachments')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {attachments.map(att => (
            <AttachmentPreview
              key={att.id}
              attachment={att}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
