import { verificationsType } from '@/types/challenge';
import { Database } from '@/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { getEndOfDayISO, getStartOfDayISO } from './dateFormatter';

const DATA_PER_PAGE = 5;

export const fetchDataByInfinityQuery = async (client: SupabaseClient<Database>, id: string, offset?: number) => {
  const query = client
    .from('challengeVerify')
    .select('*,users (id, nickname, email,profileURL)')
    .eq('challengeId', id)
    .gte('date', getStartOfDayISO()) // 인증 오늘꺼만 가져오게?
    .lte('date', getEndOfDayISO())
    .order('date', { ascending: false });

  if (offset) {
    const from = offset * DATA_PER_PAGE;
    const to = from + DATA_PER_PAGE - 1;

    query.range(from, to);
  } else {
    query.limit(5);
  }

  const response = await query;

  return response.data as verificationsType[];
};

export const fetchVerificationTotalData = async (client: SupabaseClient<Database>, id: string) => {
  const response = await client.from('challengeVerify').select('*').eq('challengeId', id);

  const data = {
    totalVerifications: response.data?.length,
    totalUsers: new Set(response.data?.map((d) => d.userId)).size,
  };

  return data;
};
