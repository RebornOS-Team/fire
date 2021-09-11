import {ipcRenderer} from 'electron';
import React, {useEffect, useState} from 'react';
import {Message} from 'rsuite';

/**
 * @function NetworkDetection
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for detecting network connection
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function NetworkDetection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    window.addEventListener('offline', () => {
      setIsOnline(false);
      ipcRenderer.send('debug', 'Network state changed: offline');
    });
    window.addEventListener('online', () => {
      setIsOnline(true);
      ipcRenderer.send('debug', 'Network state changed: online');
    });
  }, []);
  return (
    <Message
      showIcon
      type="warning"
      title="No Network"
      description="No connectivity or limited network connectivity, Your installations might fail."
      closable={true}
      style={{
        display: isOnline ? 'none' : 'flex',
      }}
    />
  );
}
