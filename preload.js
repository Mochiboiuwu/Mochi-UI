const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
    executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
    getDirContents: (dirPath) => ipcRenderer.invoke('get-dir-contents', dirPath)
});