import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET single task
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: task, error } = await supabase
      .from('task_list')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update a task
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Do not allow updating id, user_id, or created_at directly
    delete body.id;
    delete body.user_id;
    delete body.created_at;

    const { data: updatedTask, error } = await supabase
      .from('task_list')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a task and all its subtasks recursively
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Recursively collect all descendant task IDs before deletion
    async function collectDescendantIds(taskId: string): Promise<string[]> {
      const { data: children, error } = await supabase
        .from('task_list')
        .select('id')
        .eq('parent_task_id', taskId);

      if (error || !children || children.length === 0) return [];

      const ids: string[] = children.map((c: { id: string }) => c.id);
      for (const child of children) {
        const nested = await collectDescendantIds(child.id);
        ids.push(...nested);
      }
      return ids;
    }

    // Gather all descendant IDs
    const descendantIds = await collectDescendantIds(id);

    // Delete descendants first (deepest first to avoid FK conflicts)
    if (descendantIds.length > 0) {
      const { error: subtaskError } = await supabase
        .from('task_list')
        .delete()
        .in('id', descendantIds);

      if (subtaskError) {
        return NextResponse.json({ error: subtaskError.message }, { status: 500 });
      }
    }

    // Now delete the parent task
    const { error } = await supabase
      .from('task_list')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('DELETE task error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
