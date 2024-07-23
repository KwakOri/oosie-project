import Link from 'next/link';
import DashBoard from './_components/DashBoard';

const RootPage = async ({ searchParams: { query } }: { searchParams: { query: string } }) => {
  return (
    <div className="h-screen">
      <Link
        className="bg-[#A6A6A6] rounded-md pt-2 pb-2 pl-6 pr-6 transition-all duration-300 ease-in-out hover:translate-y-1 active:translate-y-2 hover:shadow-md border-b-4 border-[#858585]"
        href={'/auth_test'}
      >
        Auth 관련
      </Link>
      <DashBoard query={query} />
    </div>
  );
};

export default RootPage;
