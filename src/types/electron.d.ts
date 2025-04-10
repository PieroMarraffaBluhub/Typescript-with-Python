declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: 'start-o2ring' | 'stop-o2ring', data?: any): Promise<any>;
        on(channel: 'o2ring-data', func: (...args: any[]) => void): () => void;
      };
    };
  }
}

export {}; 