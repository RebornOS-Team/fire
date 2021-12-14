import {ipcRenderer} from 'electron';
import React, {useEffect, useState} from 'react';
import Message from 'rsuite/Message';

/**
 * @function NetworkDetection
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for detecting network connection
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function NetworkDetection() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const offline = () => {
      setIsOnline(false);
      ipcRenderer.send('debug', 'Network state changed: offline');
    };
    const online = () => {
      setIsOnline(true);
      ipcRenderer.send('debug', 'Network state changed: online');
    };
    window.addEventListener('offline', offline);
    window.addEventListener('online', online);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);
  return (
    <Message
      showIcon
      type="warning"
      header="No Network"
      closable
      style={{
        display: isOnline ? 'none' : 'inline-block',
      }}
    >
      No connectivity or limited network connectivity, Your installations might
      fail.
    </Message>
  );
}
