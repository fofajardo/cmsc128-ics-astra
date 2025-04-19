'use client'

import { useRouter } from 'next/navigation'
import React from 'react';
import { useState } from 'react';
import ToastNotification from '@/components/ToastNotification';

export function GoBackButton() {
    const router = useRouter()
  
    return (
        <button
        onClick={() => router.back()}
        className={`inline-flex items-baseline text-astrablack hover:text-astradark font-rb`}
      >
        <span className="mr-1 text-xl">←</span>
        Go Back
      </button>
    )
  }


  export function ActionButton({ label, color, onClick, route, notifyMessage, notifyType }) {
    const router = useRouter();
    const [toast, setToast] = useState(null);
  
    const handleClick = () => {
      if (onClick) return onClick();
      if (route) return router.push(route);
      if (notifyMessage) {
        setToast({ type:notifyType || 'success', message: notifyMessage});
      }
    };
  
    return (
      <>
        {toast && (
          <ToastNotification 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)}
          />
        )}
        <button className={`${color}-button font-sb`} onClick={handleClick}>
          {label}
        </button>
      </>
    );
  }