import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { ExerciseRecord } from '@/types/exercises';
interface ExerciseData {
  date: string;
  userId: string;
  exerciseType: string;
  name: string;
  id: string;
  record: any[];
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    const { date, exerciseType, name, record, isBookMark } = await request.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: '인증 오류.' }, { status: 401 });
    }

    const userId = user.id;

    // 필수 필드 검증
    if (!date || !exerciseType || !name || !record) {
      return NextResponse.json({ message: '모든 필드를 채워주겐니!!!' }, { status: 400 });
    }

    // record 필드가 JSON 배열인지 확인
    if (!Array.isArray(record)) {
      return NextResponse.json({ message: 'record 필드는 JSON 배열이어야 한단다!!!.' }, { status: 400 });
    }

    // 데이터베이스에 운동 기록 추가
    const { data, error } = await supabase
      .from('exercises')
      .insert([
        {
          date,
          userId,
          exerciseType,
          name,
          record,
        },
      ])
      .select()
      .single<ExerciseData>();

    if (error) {
      throw error;
    }

    if (isBookMark) {
      const { id } = data;
      console.log('@@ID', id);
      const { error } = await supabase.from('exercisesBookmarks').insert({ userId, exerciseId: id });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ message: '운동 기록이 성공적으로 등록되었지 뭐람?', data }, { status: 200 });
  } catch (error) {
    console.error('@@ error', error);
    return NextResponse.json(
      { message: '운동 기록 등록에 실패했습니다.', error: (error as Error).message },
      { status: 500 },
    );
  }
}