'use client';

import Header from '@/components/Header';
import Loading from '@/components/Loading/Loading';
import { useModal } from '@/contexts/modal.context/modal.context';
import { useGetUser } from '@/hooks/auth/useUsers';
import {
  useAcceptAnswer,
  useDeleteAnswer,
  useDeleteCommunityPost,
  useGetAcceptedAnswer,
  useGetAnswers,
  useGetCommunityPostDetail,
} from '@/hooks/community/useCommunity';
import { useRouter } from 'next/navigation';

import { useLevelUp } from '@/hooks/level/useLevel';
import { AnswerResponse, CommunityPostData } from '@/types/community';
import Link from 'next/link';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import FloatingWriteButton from '../../../_components/CommunityPostList/FloatingWriteButton';
import CommunityComment from './CommunityComment';
import DetailMenu from './DetailMenu';
import PostItem from './PostItem';
import QASection from './QASection';

interface CommunityPostDetailProps {
  postId: string;
  initialData: {
    post: CommunityPostData;
    answers: AnswerResponse;
  };
}

const CommunityPostDetail = ({ postId, initialData }: CommunityPostDetailProps) => {
  const { data: post, isLoading } = useGetCommunityPostDetail(postId, initialData.post);
  const { data: user } = useGetUser();
  const { data: answers, isLoading: isAnswersLoading } = useGetAnswers(postId, initialData.answers);
  const { data: isAcceptedAnswer, isLoading: isAcceptedAnswerLoading } = useGetAcceptedAnswer(postId);

  const { mutateAsync: deletePost } = useDeleteCommunityPost();
  const { mutateAsync: deleteAnswer } = useDeleteAnswer();

  const { mutate: acceptAnswer } = useAcceptAnswer();
  const { mutate: levelUp } = useLevelUp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { ref: buttonVisibilityRef, inView: buttonVisibilityInView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 200px 0px',
  });

  const router = useRouter();
  const modal = useModal();
  if (isLoading) return <Loading />;

  if (!post) return <div className="text-center py-10">게시글을 찾을 수 없습니다.</div>;

  const isAuthor = post.user.id === user?.id;

  const handleEdit = () => {
    router.push(`/community/${postId}/edit`);
  };
  const handleDelete = async () => {
    const yes = await modal.confirm(['정말로 이 게시글을 삭제하시겠습니까?']);
    if (yes) {
      try {
        await deletePost(postId);
        router.push('/community');
      } catch (error) {
        console.error('Error deleting post:', error);
        modal.alert(['게시글 삭제 중 오류가 발생했습니다.']);
      }
    }
  };
  const handleClickBack = () => {
    router.push('/community');
  };

  const handleAcceptAnswer = (answerId: string, answerUserId: string) => {
    acceptAnswer({ questionId: postId, answerId });
    levelUp({ exp: 100, uid: answerUserId });
  };
  const handleDeleteAnswer = async (answerId: string) => {
    const yes = await modal.confirm(['정말로 이 답변을 삭제하시겠습니까?']);
    if (yes) {
      try {
        await deleteAnswer({ answerId, questionId: postId });
      } catch (error) {
        console.error('Error deleting answer:', error);
        modal.alert(['답변 삭제 중 오류가 발생했습니다.']);
      }
    }
  };

  const handleEditAnswer = (answerId: string) => {
    router.push(`/community/${postId}/answer/${answerId}/edit`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden max-w-[800px] flex flex-col mx-auto text-white">
      <Header
        title={`${post.category}`}
        customBackAction={handleClickBack}
        icon={
          isAuthor && (
            <DetailMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenChange={setIsMenuOpen}
              iconClassName="w-6 h-6"
            />
          )
        }
      />
      {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsMenuOpen(false)} />}

      {post.category === 'Q&A 게시판' ? (
        <>
          <PostItem post={post} />
          <div
            className="h-[1px] bg-whiteT-20  mx-4"
            style={{
              boxShadow: '0px 1px 2px 0px rgba(255, 255, 255, 0.10), 0px -2px 4px 0px rgba(0, 0, 0, 0.70)',
            }}
          />
          <QASection
            answers={answers?.answers}
            userId={user?.id || ''}
            postId={postId}
            acceptedAnswer={answers?.acceptedAnswer}
            isAuthor={isAuthor}
            onAcceptAnswer={handleAcceptAnswer}
            isAcceptedAnswerLoading={isAcceptedAnswerLoading}
            onEditAnswer={handleEditAnswer}
            onDeleteAnswer={handleDeleteAnswer}
          />
          {!isAuthor && !answers?.hasUserAnswered && !answers.acceptedAnswer && (
            <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
              <div className="max-w-[800px] mx-auto px-4 relative">
                <div className="absolute bottom-10 right-4 md:right-10 pointer-events-auto">
                  <Link href={`/community/${post.id}/answer`}>
                    <FloatingWriteButton buttonType="answer" inView={buttonVisibilityInView} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <PostItem post={post} />
          <div
            className="h-[1px] bg-whiteT-20  mx-4"
            style={{
              boxShadow: '0px 1px 2px 0px rgba(255, 255, 255, 0.10), 0px -2px 4px 0px rgba(0, 0, 0, 0.70)',
            }}
          />
          <CommunityComment postId={post.id} postUserId={post.user.id} />
        </>
      )}
      {post.category === 'Q&A 게시판' && <div ref={buttonVisibilityRef} className="h-0 relative -z-10" />}
    </div>
  );
};

export default CommunityPostDetail;