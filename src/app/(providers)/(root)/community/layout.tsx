import BackBoard from '@/layouts/AuthMobile/BackBoard/BackBoard';
import React from 'react';

const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BackBoard />
      {children}
    </>
  );
};

export default CommunityLayout;