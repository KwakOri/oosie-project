import { createClient } from '@/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();

  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json({ error: '질문 ID가 필요합니다.' }, { status: 400 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    // communityAnswer 테이블에서 데이터 조회하고 users 테이블과 조인
    const { data: answers, error: answerError } = await supabase
      .from('communityAnswer')
      .select(
        `
        *,
        user:userId (
          id,
          nickname,
          profileURL
        )
      `,
      )
      .eq('questionId', questionId);

    if (answerError) throw answerError;

    const hasUserAnswered = answers.some((answer) => answer.userId === user?.id);

    const { data: isLike, error: isLikeError } = await supabase
      .from('communityAnswerLikes')
      .select('*')
      .eq('userId', user?.id);

    if (isLikeError) throw isLikeError;

    const answersWithLikes = answers.map((answer) => {
      const likeInfo = isLike.find((like) => like.answerId === answer.id);

      return {
        ...answer,
        isLiked: likeInfo ? likeInfo.isLike : null,
      };
    });

    const responseData = {
      answers: answersWithLikes,
      hasUserAnswered,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: '데이터를 가져오는데 실패했습니다.' }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  const supabase = createClient();

  // 사용자 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { questionId, content } = await request.json();

    // 서버 측 유효성 검사

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
    }

    // Supabase에 데이터 삽입
    const { data: answer, error } = await supabase
      .from('communityAnswer')
      .insert({
        questionId,
        content: content.trim(),
        userId: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: '답변이 성공적으로 등록되었습니다.', data: answer }, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: '답변 등록에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answerId, content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('communityAnswer')
      .update({ content: content.trim() })
      .eq('id', answerId)
      .eq('userId', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows updated, which means the answer doesn't exist or user doesn't have permission
        return NextResponse.json({ error: '답변을 수정할 권한이 없거나 답변이 존재하지 않습니다.' }, { status: 403 });
      }
      throw error;
    }

    return NextResponse.json({ message: '답변이 성공적으로 수정되었습니다.', data }, { status: 200 });
  } catch (error) {
    console.error('Error updating answer:', error);
    return NextResponse.json({ error: '답변 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const answerId = searchParams.get('answerId');
    const questionId = searchParams.get('questionId');

    console.log(questionId, answerId);

    if (!answerId || !questionId) {
      return NextResponse.json({ error: '답변 ID와 질문 ID가 필요합니다.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('communityAnswer')
      .delete()
      .eq('id', answerId)
      .eq('questionId', questionId)
      .eq('userId', user.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '답변을 삭제할 권한이 없거나 답변이 존재하지 않습니다.' }, { status: 403 });
      }
      throw error;
    }

    return NextResponse.json({ message: '답변이 성공적으로 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting answer:', error);
    return NextResponse.json({ error: '답변 삭제에 실패했습니다.' }, { status: 500 });
  }
}
