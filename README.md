# 🎨 Mochi-UI v2.0

**Advanced Terminal-Style System Monitor & File Explorer**

A modern, high-performance desktop application built with Electron, featuring real-time system monitoring, file exploration, and command execution with beautiful eDEX-UI inspired animations.

![Version](https://img.shields.io/badge/version-2.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20|%20Linux%20|%20macOS-lightgrey)

---

## ✨ Features

### 🎯 Core Features
- ⚡ **Real-time System Monitoring** - Live CPU, RAM, and GPU statistics
- 📁 **Advanced File Explorer** - Browse your file system with drive selection
- 🖥️ **Terminal Emulator** - Execute commands and view output
- 📊 **System Statistics Panel** - Detailed hardware information
- 🔄 **Process Monitor** - View top running processes with CPU/RAM usage
- 🎬 **High-Quality Animations** - Smooth transitions and effects
- 🌟 **eDEX-UI Inspired Design** - Modern terminal aesthetics with neon colors

### 🎨 Visual Features
- 🎬 Animated boot sequence with system diagnostics
- ✨ Glitch effects and neon glow animations
- 📈 Real-time system stats charts
- 🎪 Smooth transitions and hover effects
- 🔌 Scanlines and CRT effects for authentic terminal feel
- 🌈 Color-coded information (green/cyan/magenta)

### 🛠️ Technical Features
- **Secure IPC Communication** - Context isolation for security
- **Performance Optimized** - Efficient resource usage
- **Cross-Platform** - Windows, Linux, and macOS support
- **Packagable as .exe** - Easy distribution and installation
- **Customizable** - Easily modify colors and animations

---

## 📦 Requirements

- **Node.js** v14 or higher
- **npm** v6 or higher
- **Windows**, **Linux**, or **macOS**

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd d:\dev\Mochi-UI
npm install
```

### 2. Run in Development Mode

```bash
npm start
```

### 3. Build for Production

```bash
# Build as portable .exe
npm run build:win

# Build as NSIS installer
npm run build:nsis

# Build both
npm run build
```

The .exe files will be in the `dist/` directory.

---

## 📋 Available Commands

### Built-in Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Show help menu |
| `clear` | Clear terminal output |
| `system` | Show system information summary |
| `time` | Display current time |
| `date` | Display current date |
| `uptime` | Show system uptime |
| `ipconfig` | Show network information |
| `processes` | List top processes |
| `dir` / `ls` | List current directory |

Any other command is executed via the system shell (cmd.exe or bash).

---

## 📂 Project Structure

```
Mochi-UI/
├── main.js              # Electron main process
├── preload.js           # Secure preload script
├── index.html           # Application HTML structure
├── style.css            # Modern CSS with animations
├── script.js            # Frontend application logic
├── package.json         # Project dependencies & build config
├── BUILD_INSTRUCTIONS.md # Detailed build guide
├── create-icon.ps1      # Icon creation script
└── build/               # Build resources (icons, etc.)
    └── icon.ico         # Application icon
```

---

## 🔧 Configuration

### Application Settings (in `package.json`)

```json
{
  "name": "mochi-ui",
  "version": "2.0.0",
  "build": {
    "productName": "Mochi-UI",
    "appId": "com.mochiui.app",
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    }
  }
}
```

### Theme Customization (in `style.css`)

Modify these CSS variables to change colors:

```css
:root {
  --primary-color: #00ff41;        /* Green */
  --secondary-color: #ff006e;      /* Magenta */
  --accent-color: #00d4ff;         /* Cyan */
  --background-dark: #0a0e27;      /* Dark blue */
  --text-primary: #00ff41;         /* Green text */
}
```

---

## 🎨 Customization Guide

### Change Colors

1. Open `style.css`
2. Find the `:root` section (top of file)
3. Modify color variables:
   ```css
   --primary-color: #00ff41;      /* Change to your color */
   --secondary-color: #ff006e;
   --accent-color: #00d4ff;
   ```

### Modify Terminal Text

Edit the `bootSequenceText` array in `script.js`:

```javascript
const bootSequenceText = [
  "Your custom boot message",
  "Line 2",
  "..."
];
```

### Adjust Animation Speed

In `style.css`, modify animation durations:

```css
@keyframes terminal-boot {
  /* Change 0.6s to adjust speed */
  animation: terminal-boot 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 🔒 Security Features

- ✅ **Context Isolation** - Renderer process isolated from main process
- ✅ **Secure IPC** - Validated communication between processes
- ✅ **Sandbox** - Renderer runs in sandbox mode
- ✅ **Command Validation** - System commands are executed safely
- ✅ **Path Validation** - File system access is validated
- ✅ **No Remote Module** - Remote module is disabled

---

## 📊 System Information Gathering

Mochi-UI collects and displays:

- **CPU**: Model, cores, speed, current load
- **Memory**: Total, used, percentage
- **Network**: IP address, hostname
- **Operating System**: OS name and version
- **GPU**: Basic GPU information
- **Processes**: Top 10 running processes

---

## 🐛 Troubleshooting

### Issue: Application won't start

**Solution:**
```bash
npm cache clean --force
rm -r node_modules
npm install
npm start
```

### Issue: Icon not found during build

**Solution:**
```bash
# Create the icon using the provided script
powershell -ExecutionPolicy Bypass -File create-icon.ps1
npm run build:win
```

### Issue: Build fails

**Solution:**
1. Ensure `index.html` exists in root directory
2. Verify all script files are present
3. Check Node.js version: `node --version` (should be v14+)
4. Clear cache: `npm cache clean --force`

### Issue: Terminal commands not working

**Solution:**
- Ensure system shell (cmd.exe or bash) is available
- Check for special characters in commands
- Try quoted commands: `"dir C:\\"`

---

## 📦 Building & Distribution

### Build as Portable .exe

```bash
npm run build:win
# Creates: Mochi-UI-2.0.0-portable.exe
```

### Build as NSIS Installer

```bash
npm run build:nsis
# Creates: Mochi-UI-2.0.0.exe (installer)
```

### Publish to GitHub

1. Create GitHub repository
2. Push code: `git push -u origin main`
3. Create release with .exe files
4. Users can download and run

---

## 🎓 Learning Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

---

## 👨‍💻 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 🙏 Acknowledgments

- **eDEX-UI** - Inspiration for the terminal design
- **Electron** - Desktop application framework
- **Node.js** - Runtime environment

---

## 📞 Support

For issues, questions, or suggestions:

1. Check the troubleshooting section
2. Review existing issues on GitHub
3. Create a new GitHub issue with details

---

## 🚀 Future Roadmap

- [ ] Real GPU monitoring integration
- [ ] Custom theme selector
- [ ] System tray integration
- [ ] Auto-update functionality
- [ ] Plugin system
- [ ] Multi-window support
- [ ] Advanced charting
- [ ] System logs viewer

---

**Mochi-UI v2.0 - Modern System Monitoring Reimagined** 🎨✨

Made with ❤️ using Electron & Node.js
