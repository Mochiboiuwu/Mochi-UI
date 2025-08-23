// Rufe die HTML-Elemente auf, die wir manipulieren möchten
const mainUI = document.getElementById('main-ui');
const loaderScreen = document.getElementById('loader-screen');
const loaderText = document.getElementById('loader-text');
const tvEffect = document.getElementById('tv-effect');

const cpuInfo = document.getElementById('cpu-info');
const ramInfo = document.getElementById('ram-info');
const ipInfo = document.getElementById('ip-info');
const osInfo = document.getElementById('os-info');
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');

// Simulierter Lade-Text
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

// Simulierter Start-Text für das Terminal
const welcomeText = "Mochi-UI Version 1.0.0\nBooting up...\nConnecting to server...\nConnection established.\nWelcome, user!";

// Funktion, die den Text mit einem coolen Schreibeffekt ausgibt
function typeText(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeText(element, text, index + 1), 50);
    }
}

// Funktion, die den Lade-Text Zeile für Zeile ausgibt
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

// Systeminformationen aktualisieren (simuliert)
function updateSystemInfo() {
    cpuInfo.innerText = "85%";
    ramInfo.innerText = "16.0GB / 32.0GB";
    ipInfo.innerText = "192.168.1.101";
    osInfo.innerText = "MochiOS (1.0)";
}

// Funktion, die den Glitch-Effekt zufällig auslöst
function startGlitchEffect() {
    // Wahrscheinlichkeit für einen globalen Glitch (5%)
    const globalGlitchChance = 70.5; 
    const isGlobalGlitch = Math.random() < globalGlitchChance;

    // Zeit, bis der nächste Glitch beginnt (zwischen 5 und 20 Sekunden)
    const glitchDelay = Math.random() * 15000 + 5000;
    
    setTimeout(() => {
        if (isGlobalGlitch) {
            // Führe den globalen Glitch auf den Haupt-Container aus
            mainUI.classList.add('glitch-all');

            // Entferne die Klassen nach einer kurzen, intensiven Zeit (0.5 Sekunden)
            setTimeout(() => {
                mainUI.classList.remove('glitch-all');
                // Starte den Glitch-Effekt erneut
                startGlitchEffect();
            }, 500);

        } else {
            // Führe den kleinen Glitch auf die inneren Elemente aus
            const glitchTargets = document.querySelectorAll('.header, .terminal-screen, .input-line');
            const targetElement = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
            
            const textContent = targetElement.textContent;
            targetElement.classList.add('glitch');
            targetElement.setAttribute('data-glitch-text', textContent);

            // Entferne die Klasse nach einer kurzen Zeit (1 Sekunde)
            setTimeout(() => {
                targetElement.classList.remove('glitch');
                // Starte den Glitch-Effekt erneut
                startGlitchEffect();
            }, 1000);
        }
    }, glitchDelay);
}


// Hauptfunktion, die alles startet
function initializeUI() {
    updateSystemInfo();
    typeText(terminalOutput, welcomeText);
    startGlitchEffect();
}

// Ereignis-Listener für die Eingabezeile
commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command !== "") {
            terminalOutput.textContent += `\n> ${command}`;

            if (command.toLowerCase() === "help") {
                terminalOutput.textContent += "\nBefehle: help, clear, exit";
            } else if (command.toLowerCase() === "clear") {
                terminalOutput.textContent = "";
                typeText(terminalOutput, welcomeText);
            } else if (command.toLowerCase() === "exit") {
                terminalOutput.textContent += "\nShutting down...";
                setTimeout(() => window.close(), 2000);
            } else {
                terminalOutput.textContent += "\nUnbekannter Befehl. Tippe 'help' für eine Liste.";
            }
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            commandInput.value = '';
        }
    }
});

// Haupt-Logik: Starte die Lade-Sequenz erst, wenn der TV-Effekt vorbei ist
document.addEventListener('DOMContentLoaded', () => {
    tvEffect.addEventListener('animationend', () => {
        setTimeout(() => {
            tvEffect.classList.add('hidden');
            loaderScreen.classList.add('fade-in');
            bootSequence();
        }, 500);
    });
});