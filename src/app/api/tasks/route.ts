import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all tasks for a given user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: tasks, error } = await supabase
      .from('task_list')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err) {
    console.error('GET tasks error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, title, description, status, priority, effort_estimate, parent_task_id } = body;

    if (!user_id || !title) {
      return NextResponse.json({ error: 'User ID and Title are required' }, { status: 400 });
    }

    const { data: newTask, error } = await supabase
      .from('task_list')
      .insert([
        {
          user_id,
          title,
          description: description || '',
          status: status || 'TODO',
          priority: priority || 'MEDIUM',
          effort_estimate: effort_estimate || 0,
          parent_task_id: parent_task_id || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (err) {
    console.error('POST task error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
