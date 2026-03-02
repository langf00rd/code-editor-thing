import { useEffect, useRef, useState, useMemo } from 'react'
import type { OpenFile } from '../App'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'

interface EditorProps {
  openFiles: OpenFile[]
  activeFilePath: string | null
  onTabClick: (path: string) => void
  onCloseTab: (path: string) => void
  onContentChange: (content: string) => void
}

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'json':
      return 'json'
    case 'css':
      return 'css'
    case 'html':
      return 'markup'
    default:
      return 'clike'
  }
}

export default function Editor({
  openFiles,
  activeFilePath,
  onTabClick,
  onCloseTab,
  onContentChange
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null)

  useEffect(() => {
    const file = openFiles.find((f) => f.path === activeFilePath)
    setActiveFile(file || null)
  }, [activeFilePath, openFiles])

  const language = useMemo(() => {
    if (!activeFile) return 'clike'
    return getLanguageFromPath(activeFile.path)
  }, [activeFile])

  const highlightedCode = useMemo(() => {
    if (!activeFile) return ''
    const grammar = Prism.languages[language] || Prism.languages.clike
    return Prism.highlight(activeFile.content, grammar, language)
  }, [activeFile, language])

  return (
    <div className="w-[80vw] h-full flex-1 flex flex-col">
      {openFiles.length > 0 && (
        <div className="flex h-[35px] border-b">
          {openFiles.map((file) => (
            <div
              key={file.path}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                file.path === activeFilePath ? 'bg-[#1e1e1e] text-white' : ''
              } hover:bg-black hover:text-white`}
              onClick={() => onTabClick(file.path)}
            >
              <span className='whitespace-nowrap'>
                {file.name}
                {file.modified && <span className="text-[#569cd6]"> ●</span>}
              </span>
              <span
                className="opacity-60 hover:opacity-100"
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
        <div className='text-center py-32'>
          Open a folder (File → Open Folder or Ctrl+O)
        </div>
      ) : activeFile ? (
        <div className="relative flex-1 w-full h-full font-mono">
          <pre
            ref={highlightRef}
            className="absolute inset-0 p-2.5 text-[12px] overflow-auto pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
          <textarea
            ref={textareaRef}
            spellCheck={false}
            className="absolute inset-0 bg-transparent text-transparent caret-white resize-none outline-none overflow-auto"
            value={activeFile.content}
            onChange={(e) => onContentChange(e.target.value)}
            onScroll={(e) => {
              if (highlightRef.current) {
                highlightRef.current.scrollTop = e.currentTarget.scrollTop
                highlightRef.current.scrollLeft = e.currentTarget.scrollLeft
              }
            }}
          />
        </div>
      ) : null}
    </div>
  )
}