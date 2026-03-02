import { contextBridge, ipcRenderer } from 'electron'

export interface FileItem {
  name: string
  path: string
  isDirectory: boolean
}

export interface ElectronAPI {
  readDirectory: (dirPath: string) => Promise<FileItem[]>
  readFile: (filePath: string) => Promise<string>
  saveFile: (filePath: string, content: string) => Promise<boolean>
  getFolder: () => Promise<string | null>
  onFolderOpened: (callback: (path: string) => void) => void
  onToggleSidebar: (callback: () => void) => void
  onToggleTerminal: (callback: () => void) => void
  createTerminal: () => void
  onTerminalData: (callback: (data: string) => void) => void
  terminalInput: (data: string) => void
}

contextBridge.exposeInMainWorld('electronAPI', {
  readDirectory: (dirPath: string) => ipcRenderer.invoke('read-directory', dirPath),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  saveFile: (filePath: string, content: string) => ipcRenderer.invoke('save-file', filePath, content),
  getFolder: () => ipcRenderer.invoke('get-folder'),
  onFolderOpened: (callback: (path: string) => void) => {
    ipcRenderer.on('folder-opened', (_event, path) => callback(path))
  },
  onToggleSidebar: (callback: () => void) => {
    ipcRenderer.on('toggle-sidebar', () => callback())
  },
  onToggleTerminal: (callback: () => void) => {
    ipcRenderer.on('toggle-terminal', () => callback())
  },
  createTerminal: () => {
    ipcRenderer.send('create-terminal')
  },
  onTerminalData: (callback: (data: string) => void) => {
    ipcRenderer.on('terminal-data', (_event, data) => callback(data))
  },
  terminalInput: (data: string) => {
    ipcRenderer.send('terminal-input', data)
  }
} as ElectronAPI)
