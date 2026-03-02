import MonacoEditor, { loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "../lib/editor-context";
import type { OpenFile } from "../lib/types";
import { THEMES } from "../lib/themes";

const MONACO_BUILTIN_THEMES = ["vs", "vs-dark", "hc-black"];

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
    case "py":
      return "python";
    case "rs":
      return "rust";
    case "cpp":
    case "c":
    case "h":
      return "cpp";
    default:
      return "plaintext";
  }
}

interface OpenFilesListProps {
  openFiles: OpenFile[];
  activeFilePath: string | null;
  onTabClick: (path: string) => void;
  onCloseTab: (path: string) => void;
}

function OpenFilesList({ openFiles, activeFilePath, onTabClick, onCloseTab }: OpenFilesListProps) {
  return (
    <>
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
    </>
  );
}

export default function Editor() {
  const {
    openFiles,
    activeFilePath,
    setActiveFilePath,
    handleCloseTab,
    handleContentChange,
    selectedTheme,
  } = useEditor();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);
  const [monaco, setMonaco] = useState<typeof import("monaco-editor") | null>(null);

  useEffect(() => {
    const file = openFiles.find((f) => f.path === activeFilePath);
    setActiveFile(file || null);
  }, [activeFilePath, openFiles]);

  useEffect(() => {
    loader.init().then((m) => setMonaco(m));
  }, []);

  useEffect(() => {
    if (!monaco || !selectedTheme) return;

    const themeConfig = THEMES.find((t) => t.id === selectedTheme);
    if (!themeConfig) return;

    if (MONACO_BUILTIN_THEMES.includes(selectedTheme)) {
      monaco.editor.setTheme(selectedTheme);
      return;
    }

    import("shiki").then(async ({ createHighlighter }) => {
      const highlighter = await createHighlighter({
        themes: [selectedTheme],
        langs: ["javascript", "typescript", "json", "css", "html", "markdown", "python", "rust", "cpp"],
      });

      const theme = highlighter.getTheme(selectedTheme);
      const tokenColors = theme.tokenColors || [];
      const colors = theme.colors || {};
      
      monaco.editor.defineTheme(selectedTheme, {
        base: theme.type === "dark" ? "vs-dark" : "vs",
        inherit: true,
        rules: tokenColors.map((tc) => ({
          scope: tc.scope,
          token: String(tc.settings?.foreground || tc.settings?.fontStyle || ""),
        })),
        colors: {
          "editor.background": colors["editor.background"] || "#1e1e1e",
          "editor.foreground": colors["editor.foreground"] || "#d4d4d4",
        },
      });

      monaco.editor.setTheme(selectedTheme);
    });
  }, [selectedTheme, monaco]);

  const language = useMemo(() => {
    if (!activeFile) return "plaintext";
    return getLanguageFromPath(activeFile.path);
  }, [activeFile]);

  const handleEditorMount = useCallback(
    (ed: editor.IStandaloneCodeEditor) => {
      editorRef.current = ed;
    },
    [],
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        handleContentChange(value);
      }
    },
    [handleContentChange],
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
      <OpenFilesList
        openFiles={openFiles}
        activeFilePath={activeFilePath}
        onTabClick={setActiveFilePath}
        onCloseTab={handleCloseTab}
      />
      <MonacoEditor
        className="w-[100%]"
        language={language}
        theme={selectedTheme}
        value={activeFile.content}
        onChange={handleChange}
        onMount={handleEditorMount}
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
}
