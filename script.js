/* ============================================
   MOCHI-UI v2.0 - Advanced Script
   High-Performance System Monitor & Terminal
   ============================================ */

// DOM Element References
const mainUI = document.getElementById('main-ui');
const loaderScreen = document.getElementById('loader-screen');
const loaderText = document.getElementById('loader-text');
const tvEffect = document.getElementById('tv-effect');

// Header Elements
const osInfo = document.getElementById('os-info');
const ipInfo = document.getElementById('ip-info');
const hostnameInfo = document.getElementById('hostname-info');

// Terminal Elements
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');

// Left Sidebar - Processes
const processList = document.getElementById('process-list');

// Center - File Explorer
const fileList = document.getElementById('file-list');
const currentPathElement = document.getElementById('current-path');
const driveSelector = document.getElementById('drive-selector');
const explorerContainer = document.getElementById('explorer-container');

// Right Sidebar - Stats
const rightSidebar = document.querySelector('.right-sidebar');
const statsSummary = document.querySelector('.stats-summary');
const statDetails = document.getElementById('stat-details');
const closeDetailsBtn = document.getElementById('close-details-btn');

const cpuLoadValue = document.getElementById('cpu-load-value');
const ramUsageValue = document.getElementById('ram-usage-value');
const gpuLoadValue = document.getElementById('gpu-load-value');
const uptimeValue = document.getElementById('uptime-value');

const detailTitle = document.getElementById('detail-title');
const detailChart = document.getElementById('detail-chart');
const chartBars = document.getElementById('chart-bars');
const detailInfo = document.getElementById('detail-info');

// State Variables
let systemDetailsCache = null;
let currentPath = 'C:\\';
let systemStartTime = Date.now();
let statsHistory = {
  cpu: [],
  ram: [],
  maxHistory: 60
};

/* ============================================
   FILE EXPLORER FUNCTIONS
   ============================================ */

/**
 * Navigate to a directory in the file system
 */
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
    currentPathElement.textContent = currentPath;
    displayFiles(result.contents);
  } else {
    appendTerminalOutput(`\n[ERROR] Access denied: "${targetPath}"`);
  }
}

/**
 * Display files and folders in the file explorer
 */
function displayFiles(files) {
  fileList.innerHTML = '';
  
  files.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.name;
    
    if (item.isDir) {
      li.classList.add('folder');
      li.setAttribute('title', 'Click to enter directory');
    } else {
      li.classList.add('file');
      li.setAttribute('title', 'File: ' + item.name);
    }

    if (item.name === '..') {
      li.classList.add('parent-dir');
    }

    // Stagger animation
    li.style.animationDelay = (index * 0.05) + 's';

    li.addEventListener('click', () => {
      if (item.isDir) {
        navigateTo(item.name);
      } else {
        appendTerminalOutput(`\n[INFO] Selected file: ${item.name}`);
      }
    });

    li.addEventListener('mouseenter', () => {
      li.style.textShadow = '0 0 15px rgba(0, 255, 65, 1)';
    });

    li.addEventListener('mouseleave', () => {
      li.style.textShadow = 'none';
    });

    fileList.appendChild(li);
  });
}

/**
 * List available disk drives (Windows)
 */
async function listDrives() {
  const isWindows = process.platform === 'win32';
  if (!isWindows) {
    driveSelector.style.display = 'none';
    return;
  }

  // Default Windows drives - can be extended with actual detection
  const drives = ['C:\\', 'D:\\', 'E:\\', 'F:\\'];
  
  driveSelector.innerHTML = '';
  drives.forEach(drive => {
    const option = document.createElement('option');
    option.value = drive;
    option.textContent = drive;
    driveSelector.appendChild(option);
  });

  driveSelector.value = currentPath.substring(0, 3);
}

driveSelector.addEventListener('change', (event) => {
  const selectedDrive = event.target.value;
  navigateTo(selectedDrive);
});

/* ============================================
   STATISTICS & MONITORING FUNCTIONS
   ============================================ */

/**
 * Update real-time system statistics
 */
async function updateLiveStats() {
  const info = await window.api.getSystemInfo();
  if (!info) return;

  // Update header information
  osInfo.textContent = `OS: ${info.os || 'Unknown'}`;
  ipInfo.textContent = `IP: ${info.ip || 'N/A'}`;
  hostnameInfo.textContent = `Hostname: ${info.hostname || 'Unknown'}`;
  
  // Update system load statistics
  const cpuLoad = parseFloat(info.cpu.load) || 0;
  const ramUsed = parseFloat(info.mem.used) || 0;
  const ramTotal = parseFloat(info.mem.total) || 0;
  
  cpuLoadValue.textContent = `${cpuLoad.toFixed(1)} %`;
  ramUsageValue.textContent = `${ramUsed.toFixed(2)} GB / ${ramTotal.toFixed(2)} GB`;
  gpuLoadValue.textContent = `${info.gpu.load || 'N/A'} %`;
  
  // Calculate uptime
  const uptimeMs = Date.now() - systemStartTime;
  const uptimeHours = (uptimeMs / (1000 * 60 * 60)).toFixed(1);
  uptimeValue.textContent = `${uptimeHours} h`;

  // Store in history for charting
  statsHistory.cpu.push(cpuLoad);
  statsHistory.ram.push((ramUsed / ramTotal) * 100);
  
  if (statsHistory.cpu.length > statsHistory.maxHistory) {
    statsHistory.cpu.shift();
    statsHistory.ram.shift();
  }

  // Update process list
  updateProcessList(info.processes);

  // Cache for detail view
  systemDetailsCache = info;
  
  if (!statDetails.classList.contains('hidden')) {
    updateDetailInfo(info);
  }
}

/**
 * Update process list in left sidebar
 */
function updateProcessList(processes) {
  processList.innerHTML = '';
  
  // Show top 10 processes
  processes.slice(0, 10).forEach((process, index) => {
    const li = document.createElement('li');
    li.textContent = `${process.name.substring(0, 20)}... | CPU: ${process.cpu}% | RAM: ${process.mem}MB`;
    li.setAttribute('title', process.name);
    li.style.animationDelay = (index * 0.05) + 's';
    
    li.addEventListener('mouseenter', () => {
      li.style.background = 'rgba(0, 212, 255, 0.25)';
      li.style.textShadow = '0 0 15px rgba(0, 212, 255, 0.8)';
    });
    
    li.addEventListener('mouseleave', () => {
      li.style.background = 'rgba(0, 212, 255, 0.05)';
      li.style.textShadow = 'none';
    });
    
    processList.appendChild(li);
  });
}

/**
 * Display detailed system information
 */
function showDetails() {
  statsSummary.classList.add('hidden');
  statDetails.classList.remove('hidden');
  
  if (systemDetailsCache) {
    updateDetailInfo(systemDetailsCache);
  }
}

/**
 * Update detailed information display
 */
function updateDetailInfo(info) {
  // Create chart
  createStatsChart();
  
  // Create detailed information
  const htmlContent = `
    <h3>🖥️ CPU Information</h3>
    <p><strong>Model:</strong> ${info.cpu.name || 'N/A'}</p>
    <p><strong>Cores:</strong> ${info.cpu.cores || 'N/A'}</p>
    <p><strong>Clock Speed:</strong> ${info.cpu.speed || 'N/A'}</p>
    <p><strong>Current Load:</strong> ${info.cpu.load || 'N/A'}%</p>

    <h3>💾 Memory Information</h3>
    <p><strong>Total RAM:</strong> ${info.mem.total || 'N/A'} GB</p>
    <p><strong>Used RAM:</strong> ${info.mem.used || 'N/A'} GB</p>
    <p><strong>Usage Percentage:</strong> ${((info.mem.used / info.mem.total) * 100).toFixed(1)}%</p>
    
    <h3>🎮 GPU Information</h3>
    <p><strong>Model:</strong> ${info.gpu.name || 'N/A'}</p>
    <p><strong>Load:</strong> ${info.gpu.load || 'N/A'}%</p>

    <h3>🌐 Network Information</h3>
    <p><strong>IP Address:</strong> ${info.ip || 'N/A'}</p>
    <p><strong>Hostname:</strong> ${info.hostname || 'N/A'}</p>
    <p><strong>OS:</strong> ${info.os || 'N/A'}</p>

    <h3>📊 Running Processes (Top 10)</h3>
    ${info.processes.slice(0, 10).map((p, i) => 
      `<p>${i + 1}. <strong>${p.name}</strong> - CPU: ${p.cpu}% | RAM: ${p.mem}MB</p>`
    ).join('')}
  `;
  
  detailInfo.innerHTML = htmlContent;
}

/**
 * Create a simple bar chart from statistics history
 */
function createStatsChart() {
  chartBars.innerHTML = '';
  
  const maxValue = Math.max(...statsHistory.cpu, ...statsHistory.ram, 1);
  
  // Show last 30 data points
  const displayData = statsHistory.cpu.slice(-30);
  
  displayData.forEach((value) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar-item';
    const height = (value / maxValue) * 100;
    bar.style.height = height + '%';
    bar.setAttribute('title', value.toFixed(1) + '%');
    chartBars.appendChild(bar);
  });
}

// Right sidebar click handler for details
rightSidebar.addEventListener('click', (event) => {
  if (!statDetails.classList.contains('hidden')) return;
  if (event.target.closest('.stat-details')) return;
  showDetails();
});

closeDetailsBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  statsSummary.classList.remove('hidden');
  statDetails.classList.add('hidden');
});

/* ============================================
   TERMINAL & COMMAND EXECUTION
   ============================================ */

/**
 * Append text to terminal output with animation
 */
function appendTerminalOutput(text) {
  terminalOutput.textContent += text;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  
  // Animate new content
  const lines = terminalOutput.textContent.split('\n');
  const lastLine = lines[lines.length - 1];
  
  if (lastLine) {
    terminalOutput.style.animation = 'terminal-glow 0.5s ease-out';
    setTimeout(() => {
      terminalOutput.style.animation = '';
    }, 500);
  }
}

/**
 * Clear terminal output
 */
function clearTerminal() {
  terminalOutput.textContent = '';
  appendTerminalOutput('Terminal cleared.\n');
}

/**
 * Display help information
 */
function showHelp() {
  const help = `
╔════════════════════════════════════════════════╗
║           MOCHI-UI v2.0 - Help Menu            ║
╠════════════════════════════════════════════════╣
║ AVAILABLE COMMANDS:                            ║
║                                                ║
║  help              - Show this help menu       ║
║  clear             - Clear terminal output     ║
║  system            - Show system info          ║
║  processes         - List running processes    ║
║  time              - Show current time         ║
║  uptime            - Show system uptime        ║
║  ipconfig          - Show network info         ║
║  dir/ls            - List current directory    ║
║  echo <text>       - Echo text to terminal     ║
║  date              - Show current date         ║
║                                                ║
║ Any other command will be executed via shell   ║
╚════════════════════════════════════════════════╝
`;
  appendTerminalOutput(help);
}

/**
 * Show system information summary
 */
function showSystemInfo() {
  if (!systemDetailsCache) return;
  
  const info = systemDetailsCache;
  const sysInfo = `
╔════════════════════════════════════════════════╗
║         SYSTEM INFORMATION SUMMARY             ║
╠════════════════════════════════════════════════╣
OS:           ${info.os || 'N/A'}
Hostname:     ${info.hostname || 'N/A'}
IP Address:   ${info.ip || 'N/A'}

CPU:          ${info.cpu.name || 'N/A'}
Cores:        ${info.cpu.cores || 'N/A'}
Clock Speed:  ${info.cpu.speed || 'N/A'}
Load:         ${info.cpu.load || 'N/A'}%

Memory:       ${info.mem.used || 'N/A'} GB / ${info.mem.total || 'N/A'} GB
GPU:          ${info.gpu.name || 'N/A'}
╚════════════════════════════════════════════════╝
`;
  appendTerminalOutput(sysInfo);
}

/**
 * Handle command input and execution
 */
commandInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const command = commandInput.value.trim();
    commandInput.value = '';

    if (command === '') return;

    appendTerminalOutput(`\n> ${command}`);

    // Handle built-in commands
    switch (command.toLowerCase()) {
      case 'help':
        showHelp();
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'system':
        showSystemInfo();
        break;
      case 'time':
        appendTerminalOutput(`\n${new Date().toLocaleTimeString()}`);
        break;
      case 'date':
        appendTerminalOutput(`\n${new Date().toLocaleDateString()}`);
        break;
      case 'uptime': {
        const uptimeMs = Date.now() - systemStartTime;
        const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        appendTerminalOutput(`\nSystem uptime: ${days}d ${hours}h`);
        break;
      }
      case 'ipconfig':
        if (systemDetailsCache) {
          appendTerminalOutput(`\nIP Address: ${systemDetailsCache.ip || 'N/A'}`);
          appendTerminalOutput(`\nHostname: ${systemDetailsCache.hostname || 'N/A'}`);
        }
        break;
      case 'processes':
        showSystemInfo();
        break;
      case 'dir':
      case 'ls':
        appendTerminalOutput(`\n[Current Path: ${currentPath}]`);
        break;
      default:
        // Execute system command
        const result = await window.api.executeCommand(command);
        if (result.error) {
          appendTerminalOutput(`\n[ERROR] ${result.error}`);
        } else if (result.output) {
          appendTerminalOutput(`\n${result.output}`);
        } else {
          appendTerminalOutput(`\n[OK] Command executed successfully`);
        }
    }
  }
});

/* ============================================
   BOOT SEQUENCE & INITIALIZATION
   ============================================ */

const bootSequenceText = [
  "⚡ Initializing Mochi-UI v2.0 System Boot Sequence...",
  "📡 Detecting system architecture...",
  "🔍 Scanning hardware configuration...",
  "🔐 Loading security protocols...",
  "💾 Initializing kernel modules...",
  "⚙️  Configuring core components...",
  "🌐 Establishing network connection...",
  "📊 Initializing performance monitoring...",
  "🎨 Loading graphical interface...",
  "📁 Mounting file system...",
  "🎯 Running system diagnostics...",
  "✅ All systems operational...",
  "🚀 Ready for user interaction...",
  " ",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "  ✓ MOCHI-UI System Ready",
  "  Type 'help' for available commands",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
];

const welcomeTerminalText = "Welcome to Mochi-UI v2.0\n> Type 'help' for available commands\n";

/**
 * Type boot sequence text with animation
 */
function bootSequence(index = 0) {
  if (index < bootSequenceText.length) {
    loaderText.textContent += "\n" + bootSequenceText[index];
    loaderText.scrollTop = loaderText.scrollHeight;
    setTimeout(() => bootSequence(index + 1), 50);
  } else {
    setTimeout(() => {
      loaderScreen.classList.add('hidden');
      mainUI.classList.remove('hidden');
      mainUI.classList.add('fade-in');
      initializeUI();
    }, 500);
  }
}

/**
 * Initialize main UI after boot
 */
async function initializeUI() {
  // Clear terminal and show welcome
  terminalOutput.textContent = welcomeTerminalText;
  
  // Initialize all systems
  await updateLiveStats();
  await navigateTo(currentPath);
  await listDrives();
  
  // Start continuous stats update
  setInterval(updateLiveStats, 2000);
  
  // Add some animations
  animateUIElements();
  
  // Set focus on input
  commandInput.focus();
}

/**
 * Animate UI elements on startup
 */
function animateUIElements() {
  const elements = document.querySelectorAll('.sidebar, .terminal-area');
  elements.forEach((el, index) => {
    el.style.animation = `sidebar-enter 0.5s ease-out ${index * 0.1}s backwards`;
  });
}

/* ============================================
   APPLICATION STARTUP
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Start boot sequence
  tvEffect.classList.remove('hidden');
  
  tvEffect.addEventListener('animationend', () => {
    tvEffect.classList.add('hidden');
    loaderScreen.classList.add('fade-in');
    bootSequence();
  });
});

/* ============================================
   ERROR HANDLING & DEBUGGING
   ============================================ */

window.addEventListener('error', (event) => {
  console.error('Application Error:', event.error);
  appendTerminalOutput(`\n[SYSTEM ERROR] ${event.error.message}`);
});

// Export for debugging
window.mochiUI = {
  appendTerminalOutput,
  navigateTo,
  updateLiveStats,
  clearTerminal,
  showSystemInfo,
  statsHistory
};

console.log('✓ Mochi-UI v2.0 Script Loaded Successfully');
