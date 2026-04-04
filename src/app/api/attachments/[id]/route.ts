import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUCKET = 'task-attachments';

// DELETE: remove from Storage and from DB
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the record first to get the storage path
    const { data: attachment, error: fetchError } = await supabase
      .from('attachments')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    // Remove from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([attachment.storage_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      // Continue anyway to clean the DB record
    }

    // Remove DB record
    const { error: dbError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
