const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const net = require('net');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let mainWindow;
let serverProcess;

function checkServerIsReady(port, callback) {
  const client = net.createConnection({ port }, () => {
    client.end();
    callback(true);
  });

  client.on('error', () => {
    callback(false);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html')).catch(() => {
      mainWindow.loadURL('data:text/html,<h1>Failed to load frontend</h1>');
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  const serverScript = path.join(__dirname, 'backend', 'server.js');
  serverProcess = fork(serverScript, {
    env: { ...process.env },
    stdio: 'inherit',
  });

  serverProcess.on('exit', (code) => {
    console.error(`Server process exited with code: ${code}`);
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server process:', err);
  });
}

function startApp() {
  const serverPort = process.env.PORT || 4000;
  startServer();

  let timeout = 10000; // 10 seconds
  let elapsedTime = 0;

  const checkInterval = setInterval(() => {
    elapsedTime += 1000;
    checkServerIsReady(serverPort, (isReady) => {
      if (isReady) {
        clearInterval(checkInterval);
        createWindow();
      } else if (elapsedTime >= timeout) {
        clearInterval(checkInterval);
        console.error('Server failed to start within the timeout period.');
        app.quit();
      }
    });
  }, 1000);
}

// Open the serial port, read weight once, then close the port
ipcMain.handle('capture-weight', async () => {
  return new Promise((resolve, reject) => {
    const port = new SerialPort({ path: 'COM3', baudRate: 9600 }, (err) => {
      if (err) {
        console.error('Error opening serial port:', err.message);
        reject(err.message);
        return;
      }
      console.log('Serial port opened for weight capture.');
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    let capturedWeight = null;

    parser.on('data', (data) => {
      capturedWeight = data.trim();
      console.log('Received weight:', capturedWeight);
    });

    setTimeout(() => {
      port.close((err) => {
        if (err) {
          console.error('Error closing serial port:', err.message);
          reject(err.message);
        } else {
          console.log('Serial port closed after reading weight.');
          resolve(capturedWeight || 'Error: No weight captured');
        }
      });
    }, 1000); // Wait 1 second before closing the port
  });
});


app.on('ready', startApp);

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
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
