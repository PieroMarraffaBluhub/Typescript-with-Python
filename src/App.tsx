import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    const cleanup = window.electron?.ipcRenderer.on('o2ring-data', (newData) => {
      setData(newData);
      // Always add the raw output to the list
      if (newData.raw) {
        setOutput(prev => [...prev, newData.raw]);
      }
      // Also add any error messages
      if (newData.error) {
        setOutput(prev => [...prev, `Error: ${newData.error}`]);
      }
      // Add any other data as JSON
      if (!newData.raw && !newData.error) {
        setOutput(prev => [...prev, JSON.stringify(newData, null, 2)]);
      }
    });

    return () => {
      cleanup?.();
      if (isRunning) {
        window.electron?.ipcRenderer.invoke('stop-o2ring', null);
      }
    };
  }, [isRunning]);

  const handleStart = async () => {
    if (!window.electron?.ipcRenderer) {
      console.error('Electron IPC not available');
      return;
    }

    try {
      setOutput([]); // Clear previous output
      await window.electron.ipcRenderer.invoke('start-o2ring', null);
      setIsRunning(true);
    } catch (error) {
      console.error('Error starting o2ring:', error);
    }
  };

  const handleStop = async () => {
    if (!window.electron?.ipcRenderer) {
      console.error('Electron IPC not available');
      return;
    }

    try {
      await window.electron.ipcRenderer.invoke('stop-o2ring', null);
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping o2ring:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">O2Ring Data Monitor</h1>
      
      <div className="mb-4 flex justify-end">
        <button
          onClick={isRunning ? handleStop : handleStart}
          className={`px-4 py-2 rounded ${
            isRunning ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
        >
          {isRunning ? 'Stop' : 'Start'} Monitoring
        </button>
      </div>

      {/* Live Data Display */}
      {data && data.type === 'data' && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">Oxygen Level</h2>
            <div className="text-4xl font-bold text-blue-600">
              {data.o2}%
            </div>
          </div>
          
          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">Heart Rate</h2>
            <div className="text-4xl font-bold text-red-600">
              {data.hr} BPM
            </div>
          </div>

          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">Heart Rate Strength</h2>
            <div className="text-2xl font-bold text-purple-600">
              {data['hr strength']}
            </div>
          </div>

          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">Motion</h2>
            <div className="text-2xl font-bold text-green-600">
              {data.motion}
            </div>
          </div>

          <div className="p-4 border rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">Battery</h2>
            <div className="text-2xl font-bold text-yellow-600">
              {data.battery}
            </div>
          </div>
        </div>
      )}

      {/* Raw Output Display */}
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Raw Output:</h2>
        <div className="bg-gray-100 p-2 rounded h-96 overflow-y-auto font-mono text-sm">
          {output.map((line, i) => (
            <div key={i} className="mb-1 p-2 rounded bg-white">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App; 