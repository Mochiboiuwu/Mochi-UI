// Rufe die HTML-Elemente auf, die wir manipulieren möchten
const mainUI = document.getElementById('main-ui');
const loaderScreen = document.getElementById('loader-screen');
const loaderText = document.getElementById('loader-text');
const tvEffect = document.getElementById('tv-effect');

const osInfo = document.getElementById('os-info');
const ipInfo = document.getElementById('ip-info');
const hostnameInfo = document.getElementById('hostname-info');
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');

// Element für die linke Seitenleiste
const processList = document.getElementById('process-list');
const fileList = document.getElementById('file-list');
const currentPathElement = document.getElementById('current-path');
const driveSelector = document.getElementById('drive-selector');

// UI-Elemente für die rechte Seitenleiste
const rightSidebar = document.querySelector('.right-sidebar');
const statsSummary = document.querySelector('.stats-summary');
const statDetails = document.getElementById('stat-details');
const closeDetailsBtn = document.getElementById('close-details-btn');

const cpuLoadValue = document.getElementById('cpu-load-value');
const ramUsageValue = document.getElementById('ram-usage-value');
const gpuLoadValue = document.getElementById('gpu-load-value');

const detailTitle = document.getElementById('detail-title');
const detailChart = document.getElementById('detail-chart');
const detailInfo = document.getElementById('detail-info');

let systemDetailsCache = null;
let currentPath = 'C:\\'; // Initialer Pfad für Windows

// --- Funktionen für den Dateiexplorer ---
async function navigateTo(newPath) {
    const isWindows = process.platform === 'win32';
    const path = require('path');
    let targetPath;

    if (newPath === '..') {
        const pathParts = currentPath.split(isWindows ? '\\' : '/').filter(p => p !== '');
        pathParts.pop();
        if (pathParts.length > 0) {
            targetPath = pathParts.join(isWindows ? '\\' : '/') + (isWindows ? '\\' : '/');
        } else {
            targetPath = isWindows ? 'C:\\' : '/';
        }
    } else {
        if (path.isAbsolute(newPath)) {
            targetPath = newPath;
        } else {
            targetPath = path.join(currentPath, newPath);
        }
    }
    
    const result = await window.api.getDirContents(targetPath);

    if (result.success) {
        currentPath = result.path;
        currentPathElement.textContent = result.path;
        displayFiles(result.contents);
    } else {
        terminalOutput.textContent += `\nFehler: Zugriff auf "${targetPath}" verweigert.`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

function displayFiles(files) {
    fileList.innerHTML = '';
    files.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        if (item.isDir) {
            li.classList.add('folder');
        } else {
            li.classList.add('file');
        }

        if (item.name === '..') {
            li.classList.add('parent-dir');
        }

        li.addEventListener('click', () => {
            if (item.isDir) {
                navigateTo(item.name);
            } else {
                terminalOutput.textContent += `\n> Befehl: Öffne Datei ${item.name}`;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });
        fileList.appendChild(li);
    });
}

async function listDrives() {
    const isWindows = process.platform === 'win32';
    if (!isWindows) {
        driveSelector.style.display = 'none';
        return;
    }

    // Temporäre Funktion zum Abrufen von Laufwerken (muss in main.js implementiert werden)
    const drives = ['C:\\', 'D:\\', 'E:\\']; // Beispiel-Laufwerke
    
    driveSelector.innerHTML = '';
    drives.forEach(drive => {
        const option = document.createElement('option');
        option.value = drive;
        option.textContent = drive;
        driveSelector.appendChild(option);
    });

    driveSelector.value = currentPath.substring(0, 3); // Wählt das aktuelle Laufwerk aus
}

driveSelector.addEventListener('change', (event) => {
    const selectedDrive = event.target.value;
    navigateTo(selectedDrive);
});

// --- Funktionen für die Haupt-UI ---
function showDetails() {
    statsSummary.classList.add('hidden');
    statDetails.classList.remove('hidden');
    
    detailTitle.textContent = "SYSTEM DETAILS";
    if (systemDetailsCache) {
        updateDetailInfo(systemDetailsCache);
    }
}

function updateDetailInfo(info) {
    const htmlContent = `
        <h3>CPU Information</h3>
        <p>Name: ${info.cpu.name || 'N/A'}</p>
        <p>Cores: ${info.cpu.cores || 'N/A'}</p>
        <p>Speed: ${info.cpu.speed || 'N/A'}</p>

        <h3>RAM Information</h3>
        <p>Total: ${info.mem.total} GB</p>
        <p>Used: ${info.mem.used} GB</p>
        
        <h3>GPU Information</h3>
        <p>Model: ${info.gpu.name || 'N/A'}</p>
        <p>Load: ${info.gpu.load || 'N/A'}%</p>
    `;
    detailInfo.innerHTML = htmlContent;
}

rightSidebar.addEventListener('click', (event) => {
    if (!statDetails.classList.contains('hidden')) {
        showDetails();
    }
});

closeDetailsBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    statsSummary.classList.remove('hidden');
    statDetails.classList.add('hidden');
});

const bootText = [
    "Initializing Mochi-UI v1.0.0...",
    "Scanning system architecture...",
    "Loading kernel modules...",
    "Verifying integrity of core components...",
    "Establishing secure quantum link...",
    "Parsing protocol manifest...",
    "Compiling graphical user interface...",
    "Rendering fractal encryption matrix...",
    "Defragmenting virtual memory...",
    "Calibrating chronometric displacement...",
    "Running diagnostic routines...",
    "Bypassing security protocols...",
    "Accessing encrypted data streams...",
    "Initializing display drivers...",
    "Loading holographic overlays...",
    "Activating retinal projection...",
    "Executing final boot sequence...",
    "Boot sequence complete.",
    "--------------------------------------",
    "  MOCHI-UI SYSTEM BOOT SEQUENCE",
    "--------------------------------------",
    "  [STATUS] Loading core system libraries...",
    "  [STATUS] Verifying kernel checksums...",
    "  [STATUS] Initializing network stack...",
    "  [OK] Network stack initialized.",
    "  [STATUS] Scanning for active devices...",
    "  [OK] Device drivers loaded.",
    "  [STATUS] Allocating memory blocks...",
    "  [OK] Memory allocation successful.",
    "  [STATUS] Launching security protocols...",
    "  [OK] Security protocols active.",
    "  [STATUS] Establishing server connection...",
    "  [OK] Connection to main server secured.",
    "  [STATUS] Loading user profile data...",
    "  [OK] Profile data loaded.",
    "  [STATUS] Starting terminal emulation...",
    "  [OK] Terminal emulation ready.",
    "  [STATUS] Finalizing system boot...",
    "  [COMPLETE] Mochi-UI is now online.",
    "--------------------------------------",
    "  [0x00A0] SYSTEM::BOOT_SEQUENCE.init()...",
    "  [0x00A1] KERNEL::LOAD_MODULES.secure_load()...",
    "  [0x00A2] DRIVER::HDD_CONTROLLER.online...",
    "  [0x00A3] DRIVER::NET_ADAPTER.online...",
    "  [0x00A4] DRIVER::GPU_RENDER.online...",
    "  [0x00A5] CPU::INSTRUCTION_SET.enable_all()...",
    "  [0x00A6] MEMORY::CACHE_FLUSH.complete...",
    "  [0x00A7] SECURITY::FIREWALL.active...",
    "  [0x00A8] NETWORK::IP_CONFIG.assigned: 192.168.1.101...",
    "  [0x00A9] USER::PROFILE.validate_token()...",
    "  [0x00AA] UI::RENDERER.load_assets()...",
    "  [0x00AB] FONT::LOAD_FONT.complete...",
    "  [0x00AC] SCRIPT::EXECUTE_SCRIPT.mochi.js...",
    "  [0x00AD] SYSTEM::FINAL_CHECKS.complete...",
    "  [0x00AE] BOOT::SEQUENCE_COMPLETE.true...",
    "  [0x00AF] LAUNCHING UI...",
    "  [0x00B0] Starting core diagnostics suite...",
    "  [0x00B1] Checking system clock synchronization...",
    "  [0x00B2] Initializing data stream encryption protocols...",
    "  [0x00B3] Establishing secure channel to remote server...",
    "  [0x00B4] Verifying cryptographic signatures...",
    "  [0x00B5] Running integrity check on filesystem...",
    "  [0x00B6] Finalizing network interface configuration...",
    "  [0x00B7] Activating user session...",
    "  [0x00B8] Loading UI presets and configuration...",
    "  [0x00B9] Syncing with cloud storage...",
    "  [0x00BA] Checking for new software updates...",
    "  [0x00BB] Optimizing system performance...",
    "  [0x00BC] Verifying system resources...",
    "  [0x00BD] Authenticating remote access protocols...",
    "  [0x00BE] Initializing user authentication module...",
    "  [0x00BF] Running pre-boot security scan...",
    "  [0x00C0] Core processes launched successfully.",
    "  [0x00C1] Kernel services operational.",
    "  [0x00C2] Display drivers fully loaded.",
    "  [0x00C3] Network stack configured and active.",
    "  [0x00C4] System boot complete.",
    "  [0x00C5] Starting welcome sequence...",
    "  [0x00C6] Welcome user...",
    "  [0x00C7] Have a nice day.",
    "--------------------------------------"
];

const welcomeText = "Mochi-UI Version 1.0.0\nBooting up...\nConnecting to server...\nConnection established.\nWelcome, user!";

async function updateLiveStats() {
    const info = await window.api.getSystemInfo();
    if (info) {
        osInfo.innerText = `OS: ${info.os}`;
        ipInfo.innerText = `IP: ${info.ip}`;
        hostnameInfo.innerText = `Hostname: ${info.hostname}`;
        
        cpuLoadValue.innerText = `${info.cpu.load}%`;
        ramUsageValue.innerText = `${info.mem.used} GB / ${info.mem.total} GB`;
        gpuLoadValue.innerText = `${info.gpu.load}%`;

        processList.innerHTML = '';
        info.processes.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.name} - CPU: ${p.cpu}% | RAM: ${p.mem}MB`;
            processList.appendChild(li);
        });
        
        systemDetailsCache = info;
        if (!statDetails.classList.contains('hidden')) {
            updateDetailInfo(info);
        }
    }
}

function typeText(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeText(element, text, index + 1), 50);
    }
}

function bootSequence(index = 0) {
    if (index < bootText.length) {
        loaderText.textContent += "\n" + bootText[index];
        loaderText.scrollTop = loaderText.scrollHeight;
        setTimeout(() => bootSequence(index + 1), 30); 
    } else {
        setTimeout(() => {
            loaderText.scrollTop = loaderText.scrollHeight;
            loaderScreen.classList.add('hidden');
            mainUI.classList.remove('hidden');
            mainUI.classList.add('fade-in');
            initializeUI();
        }, 100);
    }
}

function startGlitchEffect() {
    const globalGlitchChance = 0.05; 
    const isGlobalGlitch = Math.random() < globalGlitchChance;
    const glitchDelay = Math.random() * 15000 + 5000;
    
    setTimeout(() => {
        if (isGlobalGlitch) {
            mainUI.classList.add('glitch-all');
            setTimeout(() => {
                mainUI.classList.remove('glitch-all');
                startGlitchEffect();
            }, 500);
        } else {
            const glitchTargets = document.querySelectorAll('.header, .terminal-screen, .input-line');
            const targetElement = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
            
            const textContent = targetElement.textContent;
            targetElement.classList.add('glitch');
            targetElement.setAttribute('data-glitch-text', textContent);

            setTimeout(() => {
                targetElement.classList.remove('glitch');
                startGlitchEffect();
            }, 1000);
        }
    }, glitchDelay);
}

function initializeUI() {
    updateLiveStats();
    setInterval(updateLiveStats, 2000);
    typeText(terminalOutput, welcomeText);
    startGlitchEffect();
    navigateTo(currentPath);
    listDrives();
}

commandInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command !== "") {
            terminalOutput.textContent += `\n> ${command}`;
            
            const result = await window.api.executeCommand(command);
            
            if (result.error) {
                terminalOutput.textContent += `\nFehler: ${result.error}`;
            } else {
                terminalOutput.textContent += `\n${result.output}`;
            }
            
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            commandInput.value = '';
        }
    }
});

// Neu: Führt die Boot-Sequenz beim Laden der Seite aus
document.addEventListener('DOMContentLoaded', () => {
    // Stellen Sie sicher, dass der TV-Effekt zu Beginn sichtbar ist
    tvEffect.classList.remove('hidden');
    
    // Die Boot-Sequenz startet jetzt nach dem TV-Effekt
    tvEffect.addEventListener('animationend', () => {
        tvEffect.classList.add('hidden');
        loaderScreen.classList.add('fade-in');
        bootSequence();
    });
});