const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow: typeof BrowserWindow | null = null;
let pythonProcess: any = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }
}

// Start Python process and handle data streaming
ipcMain.handle('start-o2ring', async () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }

  // Get the correct path based on development or production
  const isDev = process.env.NODE_ENV === 'development';
  const pythonScriptPath = path.join(
    isDev ? process.cwd() : path.dirname(app.getAppPath()),
    isDev ? 'src/python/o2ring.py' : 'python/o2ring.py'
  );

  console.log('Current working directory:', process.cwd());
  console.log('Python script path:', pythonScriptPath);
  console.log('File exists:', require('fs').existsSync(pythonScriptPath));

  try {
    pythonProcess = spawn('python3', [pythonScriptPath], {
      stdio: 'pipe',
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });

    pythonProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString().trim();
      console.log('Python output:', output);
      
      try {
        const result = JSON.parse(output);
        if (mainWindow) {
          mainWindow.webContents.send('o2ring-data', result);
        }
      } catch (e) {
        if (mainWindow) {
          mainWindow.webContents.send('o2ring-data', { raw: output });
        }
      }
    });

    pythonProcess.stderr.on('data', (data: Buffer) => {
      const error = data.toString();
      console.error('Python Error:', error);
      if (mainWindow) {
        mainWindow.webContents.send('o2ring-data', { error: error });
      }
    });

    pythonProcess.on('close', (code: number) => {
      console.log('Python process exited with code:', code);
      if (mainWindow) {
        mainWindow.webContents.send('o2ring-data', { status: 'exited', code });
      }
    });

    return { status: 'started' };
  } catch (error: any) {
    console.error('Error starting Python process:', error);
    return { status: 'error', error: error?.message || 'Unknown error' };
  }
});

// Stop Python process
ipcMain.handle('stop-o2ring', async () => {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
  return { status: 'stopped' };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
}); 