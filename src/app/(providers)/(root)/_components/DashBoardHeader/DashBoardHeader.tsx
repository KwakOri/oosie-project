'use client';

import InputCalendar from '@/components/Input/InputDate/InputCalendar';
import ModalPortalLayout from '@/components/ModalPortal/ModalPortalLayout';
import { addDays, format, subDays } from 'date-fns';
import Link from 'next/link';
import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { FaListUl } from 'react-icons/fa6';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
type DashBoardHeaderType = {
  date: Date;
  setState: Dispatch<SetStateAction<Date>>;
  url: string;
  title: string;
};

const DashBoardHeader = ({ date, setState, url, title }: DashBoardHeaderType) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [position, setPosition] = useState<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 });

  const handleCalendar = (e: MouseEvent<HTMLDivElement>) => {
    setPosition({ clientX: e.clientX, clientY: e.clientY });
    setIsCalendarOpen((prev) => !prev);
  };

  const handleNextDay = () => {
    setState((prev) => addDays(prev, 1));
  };

  const handlePrevDay = () => {
    setState((prev) => subDays(prev, 1));
  };

  const handleDateSelected = (date: Date) => {
    setState(date);
    setIsCalendarOpen(false);
  };

  return (
    <div className="relative flex text-white items-center justify-between w-full">
      <div className="text-xs flex items-center gap-x-1">
        <div className="text-base cursor-pointer" onClick={handlePrevDay}>
          <IoMdArrowDropleft />
        </div>

        <div onClick={(e) => handleCalendar(e)} className="cursor-pointer w-8 text-center">
          {format(date, 'M/dd')}
        </div>
        {isCalendarOpen && (
          <ModalPortalLayout onClose={() => setIsCalendarOpen(false)}>
            <div
              style={{ left: `${position.clientX}px` }}
              className={`absolute w-[280px]
                ${position.clientY > 300 ? 'top-[430px]' : 'top-[275px]'}
                text-white mt-1 bg-white/10 backdrop-blur-[20px] rounded-lg border-2 border-primary-50 shadow-lg z-20 overflow-hidden`}
            >
              <InputCalendar selectedDate={date} onSelectDate={handleDateSelected} />
            </div>
          </ModalPortalLayout>
        )}

        <div className="text-base cursor-pointer" onClick={handleNextDay}>
          <IoMdArrowDropright />
        </div>
      </div>
      <div className="absolute opacity-50 text-base left-1/2 transform -translate-x-1/2">{title}</div>

      <div className="cursor-pointer text-xl opacity-70">
        <Link href={url}>
          {/* <IoCreateOutline /> */}
          <FaListUl className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default DashBoardHeader;
