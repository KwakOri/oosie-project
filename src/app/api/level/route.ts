import { createClient } from '@/supabase/server';
import { LevelType } from '@/types/level';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
  const client = createClient();
  try {
    // 대상 userId = 없으면 나, 얻은 경험치
    let { uid, exp } = await req.json();

    if (!uid) {
      const {
        data: { user },
        error,
      } = await client.auth.getUser();

      if (error) {
        console.error('Supabase auth error:', error);
        return NextResponse.json({ error: 'Failed to retrieve user', details: error.message }, { status: 500 });
      }

      if (!user) {
        console.error('User not found');
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }

      uid = user.id;
    }

    // 경험치 테이블
    const { data: experiencesTable, error: experiencesTableError } = await client.from('level').select('*');
    // uid 대상 경험치 가져오기
    const { data: userExperience, error: userExperienceError } = await client
      .from('userLevel')
      .select('*,level(*)')
      .eq('userId', uid)
      .single<LevelType>();

    if (experiencesTableError) {
      console.error('Supabase select experiencesTable error:', experiencesTableError);
      return NextResponse.json(
        { error: 'Failed To get experiencesTable', details: experiencesTableError.message },
        { status: 400 },
      );
    }

    if (userExperienceError) {
      console.error('Supabase select userExperience error:', userExperienceError);
      return NextResponse.json(
        { error: 'Failed To get userExperience', details: userExperienceError.message },
        { status: 400 },
      );
    }

    let curExp = userExperience.experience;
    let { level: curLevel } = userExperience.level;
    let newExp = curExp + exp;
    let requiredExp = experiencesTable[curLevel - 1].experience;

    while (newExp >= requiredExp) {
      newExp -= requiredExp;
      curLevel += 1;
      requiredExp = experiencesTable[curLevel - 1].experience;
    }

    const { data, error } = await client
      .from('userLevel')
      .update({ level: curLevel, experience: newExp })
      .eq('userId', uid);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed To Update Level', details: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Level Update Successfully', data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected level update error:', error);
    return NextResponse.json({ error: 'Level Update Failed' }, { status: 500 });
  }
};
