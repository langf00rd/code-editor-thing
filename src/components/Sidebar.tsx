import { useState, useCallback } from 'react'
import type { FileItem } from '../../electron/preload'

interface TreeItemProps {
  item: FileItem
  level: number
  onFileSelect: (item: FileItem) => void
  onRefresh: (folderPath: string) => void
}

function TreeItem({ item, level, onFileSelect, onRefresh }: TreeItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState<FileItem[]>([])

  const handleClick = async () => {
    if (item.isDirectory) {
      if (!expanded) {
        const items = await window.electronAPI.readDirectory(item.path)
        setChildren(items.filter((i) => !i.name.startsWith('.')))
      }
      setExpanded(!expanded)
    } else {
      onFileSelect(item)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2.5 cursor-pointer text-[13px] hover:bg-[#2a2d2e] ${
          item.isDirectory ? 'text-[#e8ab6b]' : 'text-[#d4d4d4]'
        }`}
        style={{ paddingLeft: `${10 + level * 15}px` }}
        onClick={handleClick}
      >
        <span className="mr-1.5 text-[10px]">
          {item.isDirectory ? (expanded ? '📂' : '📁') : '📄'}
        </span>
        <span>{item.name}</span>
      </div>
      {expanded && item.isDirectory && (
        <div>
          {children.map((child) => (
            <TreeItem
              key={child.path}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  fileTree: FileItem[]
  onFileSelect: (item: FileItem) => void
  onRefresh: (folderPath: string) => void
  currentFolder: string | null
}

export default function Sidebar({ fileTree, onFileSelect, onRefresh, currentFolder }: SidebarProps) {
  return (
    <div className="w-[250px] bg-[#252526] border-r border-[#3c3c3c] flex flex-col overflow-hidden">
      <div className="px-2.5 py-2.5 text-[11px] font-semibold uppercase text-[#bbbbbb] border-b border-[#3c3c3c]">
        Explorer
      </div>
      <div className="flex-1 overflow-auto py-1">
        {fileTree.map((item) => (
          <TreeItem
            key={item.path}
            item={item}
            level={0}
            onFileSelect={onFileSelect}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  )
}
