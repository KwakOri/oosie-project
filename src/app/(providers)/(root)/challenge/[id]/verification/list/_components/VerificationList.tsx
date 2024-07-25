'use client';

import { createClient } from '@/supabase/client';
import { verificationsType } from '@/types/challenge';
import { fetchDataByInfinityQuery } from '@/utils/dataFetching';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import VerificationCard from './VerificationCard';
import VerificationCardSkeleton from './VerificationCardSkeleton';

const VerificationList = () => {
  const params = useParams();
  const obsRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const {
    data: verifications,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['verifications'],
    queryFn: ({ pageParam }) => fetchDataByInfinityQuery(supabase, params.id as string, pageParam),
    getNextPageParam: (lastPage: verificationsType[], allPage: verificationsType[][]) => {
      // console.log('LASTPAGE', lastPage);
      // console.log('ALLPAGE', allPage);
      const nextPage = lastPage.length === 5 ? allPage.length : undefined;
      return nextPage;
    },
    initialPageParam: 1,
    select: (data) => data.pages.flatMap((p) => p),
    staleTime: Infinity,
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.9 },
    );

    const currentRef = obsRef.current;

    if (currentRef) obs.observe(currentRef);

    return () => {
      if (currentRef) obs.unobserve(currentRef);
    };
  }, [verifications, fetchNextPage, hasNextPage]);

  return (
    <>
      {verifications && !verifications.length && (
        <div>
          <p>헉.. 아직 아무도 인증하지 않았네요!</p>
          <p>먼저 나서서 인증.. 해야겠지?</p>
        </div>
      )}
      {verifications && verifications.length > 0 && (
        <>
          <h4 className="text-right text-xs font-bold mb-5">오늘 벌써 총 456명이 인증했어요!</h4>
          <ul className="flex flex-col gap-y-4">
            {verifications?.map((verification, i) => (
              <li key={verification.id}>
                <VerificationCard verification={verification} />
              </li>
            ))}
            {isFetching && hasNextPage && Array.from({ length: 5 }).map((_, i) => <VerificationCardSkeleton key={i} />)}
          </ul>
        </>
      )}

      {!isFetching && hasNextPage && <div ref={obsRef} className="h-20 w-full" />}
    </>
  );
};

export default VerificationList;
