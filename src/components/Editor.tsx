import { useEffect, useRef, useState } from 'react'
import type { OpenFile } from '../App'

interface EditorProps {
  openFiles: OpenFile[]
  activeFilePath: string | null
  onTabClick: (path: string) => void
  onCloseTab: (path: string) => void
  onContentChange: (content: string) => void
}

export default function Editor({
  openFiles,
  activeFilePath,
  onTabClick,
  onCloseTab,
  onContentChange
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null)

  useEffect(() => {
    const file = openFiles.find((f) => f.path === activeFilePath)
    setActiveFile(file || null)
  }, [activeFilePath, openFiles])

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[#1e1e1e]">
      {openFiles.length > 0 && (
        <div className="flex bg-[#252526] border-b border-[#3c3c3c] min-h-[35px]">
          {openFiles.map((file) => (
            <div
              key={file.path}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-[13px] border-r border-[#1e1e1e] ${
                file.path === activeFilePath ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d]'
              } hover:bg-[#2a2d2e]`}
              onClick={() => onTabClick(file.path)}
            >
              <span>
                {file.name}
                {file.modified && <span className="text-[#569cd6]">●</span>}
              </span>
              <span
                className="text-[14px] opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(file.path)
                }}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
      {openFiles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#6a6a6a] text-lg">
          Open a folder (File → Open Folder or Ctrl+O)
        </div>
      ) : activeFile ? (
        <textarea
          ref={textareaRef}
          className="flex-1 w-full p-2.5 bg-[#1e1e1e] text-[#d4d4d4] border-none resize-none font-mono text-[14px] leading-[1.5] outline-none"
          value={activeFile.content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
        />
      ) : null}
    </div>
  )
}
