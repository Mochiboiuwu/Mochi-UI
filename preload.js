/* ============================================
   MOCHI-UI v2.0 - Preload Script
   Secure IPC Bridge for Renderer Process
   ============================================ */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expose secure API to renderer process
 * Using context isolation for security
 */
contextBridge.exposeInMainWorld('api', {
  /**
   * Get system information
   * Returns: { cpu, gpu, mem, os, ip, hostname, processes }
   */
  getSystemInfo: () => {
    return ipcRenderer.invoke('get-system-info');
  },

  /**
   * Execute a shell command
   * @param {string} command - The command to execute
   * Returns: { error, output }
   */
  executeCommand: (command) => {
    return ipcRenderer.invoke('execute-command', command);
  },

  /**
   * Get directory contents
   * @param {string} dirPath - The directory path to read
   * Returns: { success, path, contents, error }
   */
  getDirContents: (dirPath) => {
    return ipcRenderer.invoke('get-dir-contents', dirPath);
  },

  /**
   * Get application version
   */
  getVersion: () => {
    return ipcRenderer.invoke('get-version');
  }
});

// Log successful preload
console.log('✓ Preload script loaded successfully');
