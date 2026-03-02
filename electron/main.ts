import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'

let mainWindow: BrowserWindow | null = null
let currentFolder: string | null = null
let shell: ReturnType<typeof spawn> | null = null

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
const APP_PATH = app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(APP_PATH, 'dist-electron/preload.cjs')
    }
  })

  if (VITE_DEV_SERVER_URL) {
    console.log('Loading URL:', VITE_DEV_SERVER_URL)
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(APP_PATH, 'dist/index.html'))
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
  })

  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed')
  })

  createMenu()
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Folder',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFolder()
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('toggle-sidebar')
        },
        {
          label: 'Toggle Terminal',
          accelerator: 'CmdOrCtrl+`',
          click: () => mainWindow?.webContents.send('toggle-terminal')
        },
        { type: 'separator' },
        { role: 'toggleDevTools' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

async function openFolder() {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory']
  })

  if (!result.canceled && result.filePaths.length > 0) {
    currentFolder = result.filePaths[0]
    mainWindow?.webContents.send('folder-opened', currentFolder)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('read-directory', async (_event, dirPath: string) => {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    return items
      .map((item) => ({
        name: item.name,
        path: path.join(dirPath, item.name),
        isDirectory: item.isDirectory()
      }))
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        return a.name.localeCompare(b.name)
      })
  } catch {
    return []
  }
})

ipcMain.handle('read-file', async (_event, filePath: string) => {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
})

ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  } catch {
    return false
  }
})

ipcMain.handle('get-folder', () => currentFolder)

ipcMain.on('create-terminal', (event) => {
  const shellPath = process.platform === 'win32' ? 'cmd.exe' : (process.env.SHELL || '/bin/bash')
  shell = spawn(shellPath, [], { shell: true })

  shell.stdout.on('data', (data) => {
    event.sender.send('terminal-data', data.toString())
  })

  shell.stderr.on('data', (data) => {
    event.sender.send('terminal-data', data.toString())
  })

  shell.on('close', () => {
    shell = null
  })
})

ipcMain.on('terminal-input', (_event, data: string) => {
  if (shell?.stdin) {
    shell.stdin.write(data)
  }
})
