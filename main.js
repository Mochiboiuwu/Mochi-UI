const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const osu = require('node-os-utils');

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
    
    //win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('get-system-info', async () => {
        const cpu = osu.cpu;
        const mem = osu.mem;
        const os = osu.os;

        const systemInfo = {
            cpu: {},
            gpu: { name: 'N/A', load: 'N/A' }, // node-os-utils hat keine GPU-Infos
            mem: {},
            os: 'N/A',
            ip: 'N/A',
            hostname: 'N/A',
            processes: []
        };

        try {
            const cpuLoad = await cpu.usage();
            systemInfo.cpu.load = cpuLoad.toFixed(1);
        } catch (e) {
            console.error('Fehler beim Abrufen der CPU-Last:', e.message);
        }

        try {
            const memInfo = await mem.info();
            systemInfo.mem.used = (memInfo.usedMemMb / 1024).toFixed(2);
            systemInfo.mem.total = (memInfo.totalMemMb / 1024).toFixed(2);
        } catch (e) {
            console.error('Fehler beim Abrufen der RAM-Infos:', e.message);
        }

        try {
            const osInfo = await os.info();
            systemInfo.os = osInfo.distro;
            systemInfo.hostname = osInfo.hostname;
        } catch (e) {
            console.error('Fehler beim Abrufen der OS-Infos:', e.message);
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

        try {
            const network = await os.ip();
            systemInfo.ip = network;
        } catch (e) {
            console.error('Fehler beim Abrufen der IP-Adresse:', e.message);
        }

        return systemInfo;
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