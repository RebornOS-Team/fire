import {useEffect, useState} from 'react';
import {Message} from 'rsuite';

/**
 * @function NetworkDetection
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for detecting network connection
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function NetworkDetection() {
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener('offline', () => setIsOnline(false));
    window.addEventListener('online', () => setIsOnline(true));
  }, []);
  return (
    <Message
      showIcon
      type="warning"
      title="No Network"
      description="No connectivity or limited network connectivity, Your installations might fail!"
      closable={true}
      style={{
        display: isOnline ? 'none' : 'flex',
      }}
    />
  );
}
