const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  captureWeight: () => ipcRenderer.invoke('capture-weight'),
  repaintWindow: () => ipcRenderer.send('force-repaint'), // Add repaintWindow functionality
});