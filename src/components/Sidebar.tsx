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
        className={`flex p-1 items-center cursor-pointer hover:bg-neutral-100 ${
          item.isDirectory ? 'text-[#000]' : 'text-black/50'
        }`}
        style={{ paddingLeft: `${10 + level * 15}px` }}
        onClick={handleClick}
      >
        <span className="mr-1 text-[10px]">
          {item.isDirectory ? (expanded ? '-' : '+') : ''}
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

export default function Sidebar({ fileTree, onFileSelect, onRefresh }: SidebarProps) {
  return (
   <div className="h-full border-r w-[20vw]">
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
  )
}
