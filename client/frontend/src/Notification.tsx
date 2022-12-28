import React, { useState, useEffect } from 'react';

function Notification({ message }: { message: string }) {
  const [shouldShow, setShouldShow] = useState(true);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    const show = message != null && message.length > 0;
    setShouldShow(true);
    setDisplayMessage(message);
    if (show) {
      setTimeout(() => setShouldShow(false), 3000);
    }
  }, [message]);

  const top = shouldShow ? '20px' : '-400px';

  return (
    <div
      style={{
        position: 'absolute',
        right: '20px',
        top: top,
        backgroundColor: 'orange',
        height: '40px',
        width: '180px',
        padding: '8px',
      }}
    >
      {displayMessage}
    </div>
  );
}

export default Notification;
