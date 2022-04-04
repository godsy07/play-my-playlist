import React, { useEffect, useState } from "react";

import { ToastHeader, Toast } from "react-bootstrap";


export const NotificationToast = ({ title, message, duration = 2000 }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setShowToast(true);

    // Hides the message after 2 default seconds (configurable)
    setTimeout(() => setShowToast(false), duration);
  }, []);

  return (
    showToast && (
      <Toast>
        <Toast.Header>
          <strong className='me-auto'>{title}</strong>
          <small className='text-muted'>just now</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
        {/* <Toast.Header>
          <img src='holder.js/20x20?text=%20' className='rounded me-2' alt='' />
          <strong className='me-auto'>Bootstrap</strong>
          <small className='text-muted'>just now</small>
        </Toast.Header>
        <Toast.Body>See? Just like this.</Toast.Body> */}
      </Toast>
    )
  );
};
