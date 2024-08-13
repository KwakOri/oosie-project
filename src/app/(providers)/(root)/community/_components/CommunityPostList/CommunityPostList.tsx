'use client';

import Loading from '@/components/Loading/Loading';
import { useGetCommunityPosts } from '@/hooks/community/useCommunity';
import { CommunityPostData } from '@/types/community';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa6';
import { useInView } from 'react-intersection-observer';
import CommunityListHeader from './CommunityListHeader';
import CommunityPostListItem from './CommunityPostListItem';
import FloatingWriteButton from './FloatingWriteButton';

const categories = [{ value: '전체' }, { value: '자유 게시판' }, { value: 'Q&A 게시판' }, { value: '정보공유' }];

const CommunityPostList = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, prefetchAllCategories } =
    useGetCommunityPosts(
      selectedCategory,
      categories.map((c) => c.value),
    );

  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0,
  });

  const { ref: buttonVisibilityRef, inView: buttonVisibilityInView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 200px 0px',
  });

  useEffect(() => {
    prefetchAllCategories();
  }, [prefetchAllCategories]);

  useEffect(() => {
    if (loadMoreInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadMoreInView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-10 text-red-500">게시글을 불러오는데 실패했습니다.</div>;

  return (
    <div className="relative min-h-screen overflow-hidden max-w-[900px] flex flex-col mx-auto">
      <div className="fixed inset-0 bg-[#0E0C15] -z-30 overflow-hidden">
        <div className="w-[140px] h-[300px] absolute top-[70px] left-[48px] blur-[90px] rounded-full bg-[#52467B]"></div>
        <div className="w-[340px] h-[105px] absolute bottom-[110px] right-[-24px] blur-[90px] bg-white/40 rounded-full"></div>
      </div>
      <CommunityListHeader categories={categories} onCategoryChange={handleCategoryChange} />
      <div className="relative z-0 flex-grow overflow-y-auto ">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaRegCommentDots className="text-6xl mb-4" />
            <p className="text-lg font-semibold mb-2">아직 게시글이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col px-4 gap-4 ">
            {' '}
            {posts.map((post: CommunityPostData) => (
              <Link href={`/community/${post.id}`} key={post.id}>
                <CommunityPostListItem post={post} />
              </Link>
            ))}
            {isFetchingNextPage ? (
              <div className="text-center py-4">더 많은 게시글을 불러오는 중...</div>
            ) : hasNextPage ? (
              <div ref={loadMoreRef} className="h-10" />
            ) : null}
          </div>
        )}
        <div className="fixed px-4 bottom-20 right-6 md:right-10 left-6 max-w-[900px] mx-auto pointer-events-none">
          <div className="relative w-full flex justify-end">
            <FloatingWriteButton inView={buttonVisibilityInView} />
          </div>
        </div>
      </div>
      <div ref={buttonVisibilityRef} className="h-20 relative" />
    </div>
  );
};

export default CommunityPostList;
