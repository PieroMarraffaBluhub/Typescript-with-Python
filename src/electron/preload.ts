const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      invoke: (channel: string, data: any) => {
        const validChannels = ['start-o2ring', 'stop-o2ring'];
        if (validChannels.includes(channel)) {
          return ipcRenderer.invoke(channel, data);
        }
        throw new Error(`Invalid channel: ${channel}`);
      },
      on: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ['o2ring-data'];
        if (validChannels.includes(channel)) {
          const subscription = (_event: any, ...args: any[]) => func(...args);
          ipcRenderer.on(channel, subscription);
          return () => ipcRenderer.removeListener(channel, subscription);
        }
        throw new Error(`Invalid channel: ${channel}`);
      },
    },
  }
); 