const path = require('path'); const { fileURLToPath } = require('url'); const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/preload.ts
var preload_exports = {};
module.exports = __toCommonJS(preload_exports);
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
  readDirectory: (dirPath) => import_electron.ipcRenderer.invoke("read-directory", dirPath),
  readFile: (filePath) => import_electron.ipcRenderer.invoke("read-file", filePath),
  saveFile: (filePath, content) => import_electron.ipcRenderer.invoke("save-file", filePath, content),
  getFolder: () => import_electron.ipcRenderer.invoke("get-folder"),
  onFolderOpened: (callback) => {
    import_electron.ipcRenderer.on("folder-opened", (_event, path) => callback(path));
  },
  onToggleSidebar: (callback) => {
    import_electron.ipcRenderer.on("toggle-sidebar", () => callback());
  },
  onToggleTerminal: (callback) => {
    import_electron.ipcRenderer.on("toggle-terminal", () => callback());
  },
  createTerminal: () => {
    import_electron.ipcRenderer.send("create-terminal");
  },
  onTerminalData: (callback) => {
    import_electron.ipcRenderer.on("terminal-data", (_event, data) => callback(data));
  },
  terminalInput: (data) => {
    import_electron.ipcRenderer.send("terminal-input", data);
  }
});
//# sourceMappingURL=preload.js.map
