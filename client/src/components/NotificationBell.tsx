import React, { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationBellProps {
  notifications: NotificationItem[];
  onMarkRead?: () => void;
}

const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

function NotificationBell({ notifications, onMarkRead }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadNotifications = notifications.filter((item) => !item.isRead);
  const recentNotifications = notifications.slice(0, 6);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && unreadNotifications.length > 0 && onMarkRead) {
        onMarkRead();
      }
      return next;
    });
  };

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={handleToggle}
        className='relative flex items-center justify-center text-white transition-opacity hover:opacity-90'
        aria-label='Notifications'
      >
        <NotificationsIcon className='sm:!text-[30px] xs:!text-[20px]' />
        {unreadNotifications.length > 0 && (
          <span className='absolute -right-2 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
            {unreadNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 top-[calc(100%+12px)] z-50 w-[320px] rounded-2xl border border-[#e5e7eb] bg-white p-3 shadow-2xl'>
          <div className='mb-2 flex items-center justify-between border-b border-[#eef1f7] pb-2'>
            <h3 className='text-sm font-semibold text-[#2e294e]'>Notifications</h3>
            <span className='rounded-full bg-[#f2f4fc] px-2 py-1 text-[11px] font-medium text-[#2e294e]'>
              {recentNotifications.length}
            </span>
          </div>

          {recentNotifications.length > 0 ? (
            <div className='max-h-[320px] space-y-2 overflow-y-auto'>
              {recentNotifications.map((item) => (
                <div key={item.id} className={`rounded-xl p-3 ring-1 ${item.isRead ? 'bg-[#f6f7fb] ring-[#e5e7eb]' : 'bg-[#f7f9ff] ring-[#dfe7ff]'}`}>
                  <div className='flex items-start justify-between gap-3'>
                    <p className='text-sm font-semibold text-[#2e294e]'>{item.title}</p>
                    <span className='whitespace-nowrap text-[10px] text-[#6b7280]'>{formatTime(item.createdAt)}</span>
                  </div>
                  <p className='mt-1 text-xs leading-5 text-[#555]'>{item.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-xl bg-[#f7f9ff] p-3 text-sm text-[#555]'>No new notifications.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
