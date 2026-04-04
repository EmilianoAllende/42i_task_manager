"use client";

import { Attachment } from "@/types/attachment";
import { useLang } from "@/context/LanguageContext";
import { Download, FileText, Trash2 } from "lucide-react";

interface Props {
  attachment: Attachment;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentPreview({ attachment, onDelete }: Props) {
  const { t } = useLang();
  const { file_type, file_name, public_url, file_size, id } = attachment;

  const isImage = file_type.startsWith("image/");
  const isAudio = file_type.startsWith("audio/");
  const isVideo = file_type.startsWith("video/");
  const isPdf = file_type === "application/pdf";

  return (
    <div className="border border-surface-border rounded-xl overflow-hidden bg-surface-hover/40 group">
      {/* Preview area */}
      <div className="relative">
        {isImage && (
          <a href={public_url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={public_url}
              alt={file_name}
              className="w-full h-36 object-cover hover:opacity-90 transition-opacity"
            />
          </a>
        )}
        {isVideo && (
          <video
            controls
            className="w-full max-h-48 bg-black"
            preload="metadata"
          >
            <source src={public_url} type={file_type} />
          </video>
        )}
        {isAudio && (
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20">
            <audio controls className="w-full" preload="metadata">
              <source src={public_url} type={file_type} />
            </audio>
          </div>
        )}
        {isPdf && (
          <iframe
            src={`${public_url}#toolbar=0`}
            className="w-full h-48 border-0"
            title={file_name}
          />
        )}
        {!isImage && !isVideo && !isAudio && !isPdf && (
          <div className="h-20 flex items-center justify-center bg-surface-hover">
            <FileText size={32} className="text-slate-400" />
          </div>
        )}
      </div>

      {/* Footer with name, size and actions */}
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium truncate text-slate-700 dark:text-slate-200" title={file_name}>
            {file_name}
          </p>
          {file_size && (
            <p className="text-xs text-slate-400">{formatBytes(file_size)}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <a
            href={public_url}
            download={file_name}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-600 dark:text-brand-400 transition-colors"
            title={t("download")}
          >
            <Download size={15} />
          </a>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
            title={t("delete_attachment")}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
