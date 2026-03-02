/// <reference types="vite/client" />

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface ElectronAPI {
  readDirectory: (dirPath: string) => Promise<FileItem[]>;
  readFile: (filePath: string) => Promise<string>;
  saveFile: (filePath: string, content: string) => Promise<boolean>;
  getFolder: () => Promise<string | null>;
  onFolderOpened: (callback: (path: string) => void) => void;
  removeFolderOpened: (callback: (path: string) => void) => void;
  onToggleSidebar: (callback: () => void) => void;
  removeToggleSidebar: (callback: () => void) => void;
  onToggleTerminal: (callback: () => void) => void;
  removeToggleTerminal: (callback: () => void) => void;
  createTerminal: () => void;
  onTerminalData: (callback: (data: string) => void) => void;
  terminalInput: (data: string) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
