import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    terminalRef.current.focus()

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
      console.log('term data',data)
      if (window.electronAPI?.terminalInput) {
        window.electronAPI.terminalInput(data)
      }
    })
  }, [])

  return (
        <div className='w-full h-full h-full' ref={terminalRef}   />
  )
}
