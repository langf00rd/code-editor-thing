import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'Monaco, Menlo, Courier New, monospace',
      theme: { background: '#1e1e1e', foreground: '#d4d4d4' }
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term

    if (window.electronAPI?.createTerminal) {
      window.electronAPI.createTerminal()
    }

    if (window.electronAPI?.onTerminalData) {
      window.electronAPI.onTerminalData((data: string) => {
        term.write(data)
      })
    }

    term.onData((data) => {
      if (window.electronAPI?.terminalInput) {
        window.electronAPI.terminalInput(data)
      }
    })

    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [])

  return (
    <div className="h-[30vh] bg-[#1e1e1e] border-t border-[#3c3c3c] flex flex-col">
      <div className="px-2.5 py-1 bg-[#252526] text-[12px] border-b border-[#3c3c3c] flex justify-between">
        <span>Terminal</span>
      </div>
      <div ref={terminalRef} className="flex-1 p-1" />
    </div>
  )
}
