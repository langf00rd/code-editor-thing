import MonacoEditor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OpenFile } from "../App";

interface EditorProps {
  openFiles: OpenFile[];
  activeFilePath: string | null;
  onTabClick: (path: string) => void;
  onCloseTab: (path: string) => void;
  onContentChange: (content: string) => void;
}

function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
}

export default function Editor(props: EditorProps) {
  const { openFiles, activeFilePath, onTabClick, onCloseTab, onContentChange } =
    props;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);

  useEffect(() => {
    const file = openFiles.find((f) => f.path === activeFilePath);
    setActiveFile(file || null);
  }, [activeFilePath, openFiles]);

  const language = useMemo(() => {
    if (!activeFile) return "plaintext";
    return getLanguageFromPath(activeFile.path);
  }, [activeFile]);

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
    },
    [],
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onContentChange(value);
      }
    },
    [onContentChange],
  );

  if (!activeFile) {
    return (
      <div className="flex items-center justify-center p-5 h-screen">
        Open a folder (File → Open Folder or Ctrl+O)
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-240px)] h-screen">
      <OpenFilesList {...props} />
      <MonacoEditor
        className="w-[100%]"
        language={language}
        value={activeFile.content}
        onChange={handleChange}
        onMount={handleEditorMount}
        // theme="vs-dark"
        options={{
          fontSize: 12,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 10 },
        }}
      />
    </div>
  );

  return (
    <div className="bg-blue-200 p-1 h-screen">
      {openFiles.length > 0 && (
        <div className="flex h-[32px] border-b">
          {openFiles.map((file) => (
            <div
              key={file.path}
              className={`flex items-center gap-2 px-3 cursor-pointer ${
                file.path === activeFilePath ? "bg-neutral-200" : ""
              } hover:bg-neutral-300`}
              onClick={() => onTabClick(file.path)}
            >
              <p className="whitespace-nowrap text-[12px]">
                {file.name}
                {file.modified && <span className="text-[#569cd6]"> ●</span>}
              </p>
              <span
                className="opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(file.path);
                }}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}

      {/*{openFiles.length === 0 ? (
        <div className="text-center py-32">
          Open a folder (File → Open Folder or Ctrl+O)
        </div>
      ) : activeFile ? (

      ) : null}*/}
    </div>
  );
}

function OpenFilesList(props: EditorProps) {
  return (
    <>
      {props.openFiles.length > 0 && (
        <div className="flex h-[32px] border-b">
          {props.openFiles.map((file) => (
            <div
              key={file.path}
              className={`flex items-center gap-2 px-3 cursor-pointer ${
                file.path === props.activeFilePath ? "bg-neutral-200" : ""
              } hover:bg-neutral-300`}
              onClick={() => props.onTabClick(file.path)}
            >
              <p className="whitespace-nowrap text-[12px]">
                {file.name}
                {file.modified && <span className="text-[#569cd6]"> ●</span>}
              </p>
              <span
                className="opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onCloseTab(file.path);
                }}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
