'use client';

import ChallengeIcon from '@/icons/ChallengeIcon';
import CommunityIcon from '@/icons/CommunityIcon';
import DashBoardIcon from '@/icons/DashBoardIcon';
import MyPageIcon from '@/icons/MyPageIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavItem from './NavItem';

const NavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: DashBoardIcon, text: '대시보드', href: '/' },
    { icon: CommunityIcon, text: '커뮤니티', href: '#' },
    { icon: ChallengeIcon, text: '챌린지', href: '/challenges/discover' },
    { icon: MyPageIcon, text: '마이페이지', href: '/mypage' },
  ];

  return (
    <div className="flex flex-col w-full bg-[#111111] rounded-t-2xl mt-2 absolute bottom-0">
      <div className="grid grid-cols-4 gap-1 px-2 pt-2">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} className="flex justify-center">
            <NavItem icon={item.icon} text={item.text} active={pathname === item.href} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
