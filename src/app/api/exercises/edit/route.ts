import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  console.log('!!!!!!!!!!!!!!!!', id);
  const supabase = createClient();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log('@@DATA', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}