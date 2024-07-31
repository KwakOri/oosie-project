import ChallengeReviewForm from '../_components/ChallengeReviewForm/ChallengeReviewForm';

const ChallengeReviewPage = () => {
  return (
    <div className="h-screen">
      <main className="bg-amber-300 pb-7 px-6 flex flex-col gap-6">
        챌린지 후기 등록 페이지
        <ChallengeReviewForm />
      </main>
    </div>
  );
};

export default ChallengeReviewPage;
