'use client';
import NotificationSVG from '@/assets/nav/notification.svg';
import ModalNotifications from '@/components/ModalNotifications';
import ModalPortalLayout from '@/components/ModalPortal/ModalPortalLayout';
import { useGetNotifications } from '@/hooks/notifications/useNotifications';
import { createClient } from '@/supabase/client';
import { useState } from 'react';
import { TiCancel } from 'react-icons/ti';
import IconButton from '../IconButton/IconButton';

const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const supabase = createClient();

  const { data: notifications, error } = useGetNotifications(supabase);

  if (error) {
    return (
      <div className="relative select-none cursor-not-allowed">
        <div className="absolute  size-full z-10 text-red-500 text-lg flex flex-col items-center justify-between">
          <TiCancel />
          <span className="text-sm font-bold">ERROR</span>
        </div>
        <IconButton onClick={() => setIsOpen(true)}>
          <NotificationSVG className="cursor-not-allowed" />
        </IconButton>
      </div>
    );
  }

  return (
    <>
      <div className="relative select-none">
        {isOpen && (
          <ModalPortalLayout onClose={() => setIsOpen(false)}>
            <ModalNotifications notifications={notifications} onClose={() => setIsOpen(false)} />
          </ModalPortalLayout>
        )}
        {notifications && notifications?.length > 0 && (
          <div className="absolute rounded-full size-[6px] bg-primary-100 top-2 right-2 z-10" />
        )}
        <IconButton onClick={() => setIsOpen(true)}>
          <NotificationSVG className="cursor-not-allowed" />
        </IconButton>
      </div>
    </>
  );
};

export default NotificationButton;
