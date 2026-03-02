import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Terminal from './components/Terminal'
import ThemeSelector from './components/ThemeSelector'
import type { ElectronAPI, FileItem } from '../electron/preload'

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export interface OpenFile {
  path: string
  name: string
  content: string
  modified: boolean
}

const THEMES = [
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'nord', name: 'Nord' },
  { id: 'one-dark-pro', name: 'One Dark Pro' },
  { id: 'tokyo-night', name: 'Tokyo Night' },
  { id: 'material-theme', name: 'Material Theme' },
  { id: 'vs-dark', name: 'VS Dark' },
]

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [fileTree, setFileTree] = useState<FileItem[]>([])
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState('vs-dark')
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    setIsElectron(!!window.electronAPI)

    if (window.electronAPI) {
      window.electronAPI.onFolderOpened(async (folderPath) => {
        setCurrentFolder(folderPath)
        const items = await window.electronAPI!.readDirectory(folderPath)
        setFileTree(items.filter((item) => !item.name.startsWith('.')))
      })

      window.electronAPI.onToggleSidebar(() => {
        console.log('Toggle sidebar triggered')
        setSidebarVisible((prev) => !prev)
      })

      window.electronAPI.onToggleTerminal(() => {
        console.log('Toggle terminal triggered')
        setTerminalVisible((prev) => !prev)
      })
    }
  }, [])

  const handleFileSelect = useCallback(async (item: FileItem) => {
    if (item.isDirectory) return

    const existing = openFiles.find((f) => f.path === item.path)
    if (existing) {
      setActiveFilePath(item.path)
      return
    }

    if (!window.electronAPI) return
    const content = await window.electronAPI.readFile(item.path)
    const newFile: OpenFile = {
      path: item.path,
      name: item.name,
      content,
      modified: false
    }
    setOpenFiles((prev) => [...prev, newFile])
    setActiveFilePath(item.path)
  }, [openFiles])

  const handleContentChange = useCallback((content: string) => {
    if (!activeFilePath) return
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.path === activeFilePath ? { ...f, content, modified: true } : f
      )
    )
  }, [activeFilePath])

  const handleSave = useCallback(async () => {
    if (!activeFilePath || !window.electronAPI) return
    const file = openFiles.find((f) => f.path === activeFilePath)
    if (!file) return

    await window.electronAPI.saveFile(activeFilePath, file.content)
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.path === activeFilePath ? { ...f, modified: false } : f
      )
    )
  }, [activeFilePath, openFiles])

  const handleCloseTab = useCallback((path: string) => {
    setOpenFiles((prev) => prev.filter((f) => f.path !== path))
    if (activeFilePath === path) {
      setActiveFilePath(null)
    }
  }, [activeFilePath])

  const handleRefreshTree = useCallback(async (folderPath: string) => {
    if (!window.electronAPI) return
    const items = await window.electronAPI.readDirectory(folderPath)
    setFileTree(items.filter((item) => !item.name.startsWith('.')))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  if (!isElectron) {
    return (
      <div className="flex h-screen bg-[#1e1e1e] text-[#d4d4d4] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Code Editor</h1>
          <p>Please run this app in Electron to use all features.</p>
          <p className="mt-2 text-gray-500">Run: npm run dev && node start-electron.cjs</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen'>
      {sidebarVisible && (
        <Sidebar
          fileTree={fileTree}
          onFileSelect={handleFileSelect}
          onRefresh={handleRefreshTree}
          currentFolder={currentFolder}
        />
      )}
      <div className='h-full flex flex-col w-full'>
        <Editor
        openFiles={openFiles}
        activeFilePath={activeFilePath}
        onTabClick={setActiveFilePath}
        onCloseTab={handleCloseTab}
        onContentChange={handleContentChange}
      />
      <Terminal />
      </div>
      {/* 
      <ThemeSelector
        themes={THEMES}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />
      {terminalVisible && <Terminal />} */}
    </div>
  )
}

export default App
