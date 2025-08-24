const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const osu = require('node-os-utils');
const os = require('os'); // Zusätzliches Modul für Systeminformationen
const { spawn } = require('child_process');
const fs = require('fs/promises');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
    
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('get-system-info', async () => {
        const cpuUtils = osu.cpu;
        const memUtils = osu.mem;
        const osUtils = osu.os;

        const systemInfo = {
            cpu: {},
            gpu: { name: 'N/A', load: 'N/A' },
            mem: {},
            os: 'N/A',
            ip: 'N/A',
            hostname: 'N/A',
            processes: []
        };

        try {
            const cpuLoad = await cpuUtils.usage();
            systemInfo.cpu.load = cpuLoad.toFixed(1);
        } catch (e) {
            console.error('Fehler beim Abrufen der CPU-Last:', e.message);
        }

        try {
            const memInfo = await memUtils.info();
            systemInfo.mem.used = (memInfo.usedMemMb / 1024).toFixed(2);
            systemInfo.mem.total = (memInfo.totalMemMb / 1024).toFixed(2);
        } catch (e) {
            console.error('Fehler beim Abrufen der RAM-Infos:', e.message);
        }

        try {
            const osInfo = await osUtils.info();
            systemInfo.os = osInfo.distro;
            systemInfo.hostname = osInfo.hostname;
        } catch (e) {
            console.error('Fehler beim Abrufen der OS-Infos:', e.message);
        }

        try {
            const network = await osUtils.ip();
            systemInfo.ip = network;
        } catch (e) {
            console.error('Fehler beim Abrufen der IP-Adresse:', e.message);
        }
        
        try {
            const processes = await osu.proc.topCpu(10);
            systemInfo.processes = processes.map(p => ({
                name: p.command,
                cpu: p.cpu.toFixed(1),
                mem: (p.mem / 1024).toFixed(1)
            }));
        } catch (e) {
            console.error('Fehler beim Abrufen der Prozesse:', e.message);
        }

        // Detaillierte Systeminformationen (ersetzt das fehlerhafte Modul)
        systemInfo.cpu.name = os.cpus()[0].model; // Korrekte CPU-Modellinfo
        systemInfo.cpu.cores = os.cpus().length;
        systemInfo.cpu.speed = (os.cpus()[0].speed / 1000).toFixed(2) + 'GHz';
        systemInfo.gpu.name = 'Generic GPU';
        systemInfo.gpu.load = 'N/A';

        return systemInfo;
    });

    ipcMain.handle('execute-command', (event, command) => {
        return new Promise((resolve) => {
            const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
            const args = process.platform === 'win32' ? ['/c', command] : ['-c', command];
            
            let output = '';
            let errorOutput = '';

            try {
                const child = spawn(shell, args, { timeout: 5000 });

                child.stdout.on('data', (data) => {
                    output += data.toString();
                });

                child.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                child.on('error', (err) => {
                    resolve({ error: `Kritischer Fehler: ${err.message}`, output: '' });
                });

                child.on('close', (code) => {
                    if (code !== 0) {
                        resolve({ error: `Befehl beendet mit Code ${code}:\n${errorOutput}`, output: output });
                    } else {
                        resolve({ error: '', output: output });
                    }
                });
            } catch (err) {
                resolve({ error: `Fehler beim Starten des Prozesses: ${err.message}`, output: '' });
            }
        });
    });

    ipcMain.handle('get-dir-contents', async (event, dirPath) => {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            const contents = entries.map(entry => {
                return {
                    name: entry.name,
                    isDir: entry.isDirectory()
                };
            });
            contents.unshift({ name: '..', isDir: true, isParent: true });
            return { success: true, path: dirPath, contents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});