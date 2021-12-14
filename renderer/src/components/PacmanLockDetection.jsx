import {ipcRenderer} from 'electron';
import React, {useEffect, useState} from 'react';
import Message from 'rsuite/Message';

/**
 * @function PacmanLockDetection
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @description Used for detecting running pacman instances
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function PacmanLockDetection() {
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const pacmanLock = (_, data) => setLocked(data);
    ipcRenderer.on('pacman-lock', pacmanLock);
    return () => {
      ipcRenderer.removeListener('pacman-lock', pacmanLock);
    };
  }, []);
  return (
    <Message
      showIcon
      type="error"
      header="Pacman DB Locked"
      closable
      style={{
        display: locked ? 'inline-block' : 'none',
      }}
    >
      Pacman db lock detected, there can be an instance of pacman running. Your
      installations will fail.
    </Message>
  );
}
