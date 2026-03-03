import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useEditor } from "../lib/editor-context";
import type { OpenFile, ThemeConfig } from "../lib/types";

function OpenFilesList(props: {
  openFiles: OpenFile[];
  onTabClick: (path: string) => void;
  onCloseTab: (path: string) => void;
  currentTheme: ThemeConfig;
  activeFilePath: string | null;
}) {
  return (
    <>
      {props.openFiles.length > 0 && (
        <div className="flex gap-2 h-[25px]">
          {props.openFiles.map((file) => (
            <div
              onClick={() => props.onTabClick(file.path)}
              key={file.path}
              className={`flex items-center gap-2 text-[12px] rounded-md px-3 cursor-pointer hover:opacity-50`}
              style={{
                backgroundColor:
                  file.path === props.activeFilePath
                    ? "var(--colors-transparent)"
                    : props.currentTheme.openFilePill?.bg,
                color: props.currentTheme.openFilePill?.fg,
              }}
            >
              <p className="whitespace-nowrap">
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
                <XIcon size={12} />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function getLanguageExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
    case "mjs":
    case "cjs":
      return javascript({ jsx: true });
    case "ts":
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "py":
      return python();
    case "html":
    case "htm":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "md":
    case "markdown":
      return markdown();
    case "rs":
      return rust();
    default:
      return null;
  }
}

function createThemeExtension(bg: string, fg: string) {
  return EditorView.theme({
    "&": {
      height: "100%",
      backgroundColor: bg,
      color: fg,
      fontSize: "14px",
    },
    ".cm-scroller": {
      fontFamily:
        "'Geist Mono', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
      lineHeight: "21px",
      padding: "12px",
    },
    ".cm-gutters": {
      backgroundColor: bg,
      color: fg,
      opacity: "0.5",
    },
    ".cm-gutters.cm-gutters-before": {
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: bg,
    },
    ".cm-gutterElement": {
      fontSize: "12px",
      opacity: 0.4,
    },
    ".cm-activeLine": {
      backgroundColor: "transparent",
    },
    ".cm-content": {
      caretColor: fg,
      lineHeight: "28px",
    },
    ".cm-cursor": {
      borderLeftColor: fg,
    },
  });
}

export default function Editor() {
  const {
    openFiles,
    activeFilePath,
    setActiveFilePath,
    handleCloseTab,
    handleContentChange,
    currentTheme,
  } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  useEffect(() => {
    if (!editorRef.current || !activeFile) return;

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const langExt = getLanguageExtension(activeFile.name);
    const extensions: any[] = [
      basicSetup,
      createThemeExtension(currentTheme.editor.bg, currentTheme.editor.fg),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          handleContentChange(update.state.doc.toString());
        }
      }),
    ];

    if (langExt) {
      extensions.push(langExt);
    }

    const state = EditorState.create({
      doc: activeFile.content,
      extensions,
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [
    activeFilePath,
    activeFile?.name,
    currentTheme.editor.bg,
    currentTheme.editor.fg,
  ]);

  if (!activeFile) {
    return (
      <div className="flex items-center justify-center p-5 w-[50vw] h-screen">
        <p className="opacity-40 text-xl">
          Open a folder (File → Open Folder or Ctrl+O)
        </p>
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-240px)] space-y-2 py-2 pb-0 pr-2 h-screen flex flex-col">
      <OpenFilesList
        openFiles={openFiles}
        onTabClick={setActiveFilePath}
        onCloseTab={handleCloseTab}
        currentTheme={currentTheme}
        activeFilePath={activeFilePath}
      />
      <div ref={editorRef} className="h-full rounded-tl-2xl overflow-hidden" />
    </div>
  );
}
