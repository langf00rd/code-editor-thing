"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var pty = __toESM(require("node-pty"), 1);
var mainWindow = null;
var currentFolder = null;
var ptyProcess = null;
var VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
var APP_PATH = import_electron.app.getAppPath();
function createWindow() {
  mainWindow = new import_electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: import_path.default.join(APP_PATH, "dist-electron/preload.cjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    console.log("Loading URL:", VITE_DEV_SERVER_URL);
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(import_path.default.join(APP_PATH, "dist/index.html"));
  }
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorCode, errorDescription);
  });
  mainWindow.webContents.on("crashed", () => {
    console.error("Renderer process crashed");
  });
  import_electron.globalShortcut.register("Command+B", () => {
    mainWindow?.webContents.send("toggle-sidebar");
  });
  import_electron.globalShortcut.register("Command+Shift+T", () => {
    mainWindow?.webContents.send("toggle-terminal");
  });
  createMenu();
}
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open Folder",
          accelerator: "CmdOrCtrl+O",
          click: () => openFolder()
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Sidebar",
          accelerator: "Command+B",
          click: () => mainWindow?.webContents.send("toggle-sidebar")
        },
        {
          label: "Toggle Terminal",
          accelerator: "Command+Shift+T",
          click: () => mainWindow?.webContents.send("toggle-terminal")
        },
        { type: "separator" },
        { role: "toggleDevTools" }
      ]
    }
  ];
  const menu = import_electron.Menu.buildFromTemplate(template);
  import_electron.Menu.setApplicationMenu(menu);
}
async function openFolder() {
  const result = await import_electron.dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    currentFolder = result.filePaths[0];
    mainWindow?.webContents.send("folder-opened", currentFolder);
  }
}
import_electron.app.whenReady().then(createWindow);
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") import_electron.app.quit();
});
import_electron.ipcMain.handle("read-directory", async (_event, dirPath) => {
  try {
    const items = import_fs.default.readdirSync(dirPath, { withFileTypes: true });
    return items.map((item) => ({
      name: item.name,
      path: import_path.default.join(dirPath, item.name),
      isDirectory: item.isDirectory()
    })).sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch {
    return [];
  }
});
import_electron.ipcMain.handle("read-file", async (_event, filePath) => {
  try {
    return import_fs.default.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
});
import_electron.ipcMain.handle("save-file", async (_event, filePath, content) => {
  try {
    import_fs.default.writeFileSync(filePath, content, "utf-8");
    return true;
  } catch {
    return false;
  }
});
import_electron.ipcMain.handle("get-folder", () => currentFolder);
import_electron.ipcMain.on("create-terminal", (event) => {
  const shellPath = process.platform === "win32" ? "powershell.exe" : process.env.SHELL || "/bin/zsh";
  ptyProcess = pty.spawn(shellPath, [], {
    name: "xterm-256color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME || process.cwd(),
    env: process.env
  });
  ptyProcess.onData((data) => {
    event.sender.send("terminal-data", data);
  });
  ptyProcess.onExit(() => {
    ptyProcess = null;
  });
});
import_electron.ipcMain.on("terminal-input", (_event, data) => {
  if (ptyProcess) {
    ptyProcess.write(data);
  }
});
//# sourceMappingURL=main.cjs.map
