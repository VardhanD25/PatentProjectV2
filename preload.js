const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  captureWeight: () => ipcRenderer.invoke('capture-weight'),
});
