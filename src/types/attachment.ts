export interface Attachment {
  id: string;
  task_id: string;
  user_id: number;
  file_name: string;
  file_type: string;
  file_size: number | null;
  storage_path: string;
  public_url: string;
  created_at: string;
}
