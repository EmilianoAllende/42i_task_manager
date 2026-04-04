import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUCKET = 'task-attachments';

// GET attachments for a task
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ attachments: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: upload file to Supabase Storage + save metadata
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;

    if (!file || !taskId || !userId) {
      return NextResponse.json({ error: 'file, taskId and userId are required' }, { status: 400 });
    }

    // Sanitize filename and build a unique storage path
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${taskId}/${Date.now()}_${safeFileName}`;

    // Upload the file as a Blob — Supabase JS SDK accepts File/Blob natively
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[attachments] Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Save metadata to the attachments table
    const { data: attachment, error: dbError } = await supabase
      .from('attachments')
      .insert([{
        task_id: taskId,
        user_id: Number(userId),
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        public_url: publicUrl,
      }])
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
