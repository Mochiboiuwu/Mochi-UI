const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');

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
    
    // DevTools für die Fehlersuche aktivieren
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('get-system-info', async () => {
        try {
            const cpuLoad = await si.currentLoad();
            const cpuInfo = await si.cpu();
            const mem = await si.mem();
            const processes = await si.processes();
            const os = await si.osInfo();
            const system = await si.system();
            const network = await si.networkInterfaces();
            
            let gpuController = { model: 'N/A', utilizationGpu: 'N/A', memoryTotal: 'N/A', memoryUsed: 'N/A' };
            try {
                const gpuInfo = await si.graphics();
                if (gpuInfo.controllers.length > 0) {
                    gpuController = gpuInfo.controllers[0];
                }
            } catch (e) {
                console.error('Fehler beim Abrufen der GPU-Informationen:', e);
            }

            const filteredProcesses = processes.list
                .filter(p => p.cpu > 0 || p.mem > 0)
                .sort((a, b) => b.cpu - a.cpu)
                .slice(0, 10);
            
            const activeNetwork = network.find(iface => iface.ip4 && !iface.internal);
            
            return {
                cpu: {
                    load: cpuLoad.currentLoad.toFixed(1),
                    name: cpuInfo.brand,
                    cores: cpuInfo.cores,
                    speed: `${cpuInfo.speed.toFixed(2)} GHz`
                },
                gpu: {
                    name: gpuController.model,
                    load: gpuController.utilizationGpu !== 'N/A' ? gpuController.utilizationGpu.toFixed(1) : 'N/A',
                    memTotal: gpuController.memoryTotal !== 'N/A' ? (gpuController.memoryTotal / 1024).toFixed(1) : 'N/A',
                    memUsed: gpuController.memoryUsed !== 'N/A' ? (gpuController.memoryUsed / 1024).toFixed(1) : 'N/A'
                },
                mem: {
                    used: (mem.used / 1024 / 1024 / 1024).toFixed(2),
                    total: (mem.total / 1024 / 1024 / 1024).toFixed(2)
                },
                os: `${os.distro} (${os.release})`,
                ip: activeNetwork ? activeNetwork.ip4 : 'N/A',
                hostname: system.model,
                processes: filteredProcesses.map(p => ({
                    name: p.name,
                    cpu: p.cpu.toFixed(1),
                    mem: (p.mem / 1024 / 1024).toFixed(1)
                }))
            };

        } catch (e) {
            console.error('Fehler im Hauptprozess beim Abrufen der Systeminfos:', e);
            return null;
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