import { PropsWithChildren } from 'react';

const Mobile = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="max-w-[390px] w-full h-[844px]">{children}</div>
    </div>
  );
};

export default Mobile;
