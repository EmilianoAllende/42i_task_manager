import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 1. Delete all tasks belonging to the user
    const { error: tasksError } = await supabase
      .from('task_list')
      .delete()
      .eq('user_id', userId);

    if (tasksError) {
      console.error('Error deleting tasks:', tasksError);
      return NextResponse.json({ error: tasksError.message }, { status: 500 });
    }

    // 2. Delete the user record
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (userError) {
      console.error('Error deleting user:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
