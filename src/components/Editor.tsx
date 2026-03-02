import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-typescript";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "../lib/editor-context";
import { THEME_STYLES } from "../lib/themes";
import type { OpenFile } from "../lib/types";

interface OpenFilesListProps {
  openFiles: OpenFile[];
  activeFilePath: string | null;
  onTabClick: (path: string) => void;
  onCloseTab: (path: string) => void;
}

function OpenFilesList({
  openFiles,
  activeFilePath,
  onTabClick,
  onCloseTab,
}: OpenFilesListProps) {
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
              <p className="whitespace-nowrap">
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

function getPrismLanguage(path: string): string {
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
      return "markup";
    case "md":
      return "markdown";
    case "py":
      return "python";
    case "rs":
      return "rust";
    case "c":
    case "h":
    case "cpp":
      return "c";
    default:
      return "plaintext";
  }
}

const THEME_COLORS: Record<string, Record<string, string>> = {
  vs: {
    keyword: "#0000ff",
    string: "#a31515",
    comment: "#008000",
    number: "#098658",
    function: "#795e26",
    operator: "#000000",
    plain: "#000000",
  },
  "vs-dark": {
    keyword: "#569cd6",
    string: "#ce9178",
    comment: "#6a9955",
    number: "#b5cea8",
    function: "#dcdcaa",
    operator: "#d4d4d4",
    plain: "#d4d4d4",
  },
  "github-dark": {
    keyword: "#ff7b72",
    string: "#a5d6ff",
    comment: "#8b949e",
    number: "#79c0ff",
    function: "#d2a8ff",
    operator: "#ff7b72",
    plain: "#c9d1d9",
  },
  "github-light": {
    keyword: "#d73a49",
    string: "#032f62",
    comment: "#6a737d",
    number: "#005cc5",
    function: "#6f42c1",
    operator: "#24292e",
    plain: "#24292e",
  },
  dracula: {
    keyword: "#ff79c6",
    string: "#f1fa8c",
    comment: "#6272a4",
    number: "#bd93f9",
    function: "#50fa7b",
    operator: "#ff79c6",
    plain: "#f8f8f2",
  },
  monokai: {
    keyword: "#f92672",
    string: "#e6db74",
    comment: "#75715e",
    number: "#ae81ff",
    function: "#a6e22e",
    operator: "#f92672",
    plain: "#f8f8f0",
  },
  nord: {
    keyword: "#81a1c1",
    string: "#a3be8c",
    comment: "#616e88",
    number: "#b48ead",
    function: "#88c0d0",
    operator: "#81a1c1",
    plain: "#d8dee9",
  },
  "one-dark-pro": {
    keyword: "#c678dd",
    string: "#98c379",
    comment: "#5c6370",
    number: "#d19a66",
    function: "#61afef",
    operator: "#56b6c2",
    plain: "#abb2bf",
  },
  "tokyo-night": {
    keyword: "#bb9af7",
    string: "#9ece6a",
    comment: "#565f89",
    number: "#ff9e64",
    function: "#7aa2f7",
    operator: "#89ddff",
    plain: "#a9b1d6",
  },
};

export default function Editor() {
  const {
    openFiles,
    activeFilePath,
    setActiveFilePath,
    handleCloseTab,
    handleContentChange,
    selectedTheme,
  } = useEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);
  const [content, setContent] = useState("");
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const file = openFiles.find((f) => f.path === activeFilePath);
    setActiveFile(file || null);
    if (file) {
      setContent(file.content);
    }
  }, [activeFilePath, openFiles]);

  const themeStyle = useMemo(() => {
    return THEME_STYLES[selectedTheme] || THEME_STYLES["vs-dark"];
  }, [selectedTheme]);

  const colors = useMemo(() => {
    return THEME_COLORS[selectedTheme] || THEME_COLORS["vs-dark"];
  }, [selectedTheme]);

  const highlighted = useMemo(() => {
    if (!content) return "";
    const lang = getPrismLanguage(activeFile?.path || "");
    const grammar = Prism.languages[lang];
    if (grammar) {
      const html = Prism.highlight(content, grammar, lang);
      return html
        .replace(
          /<span class="token keyword">/g,
          `<span style="color:${colors.keyword}">`,
        )
        .replace(
          /<span class="token string">/g,
          `<span style="color:${colors.string}">`,
        )
        .replace(
          /<span class="token comment">/g,
          `<span style="color:${colors.comment}">`,
        )
        .replace(
          /<span class="token number">/g,
          `<span style="color:${colors.number}">`,
        )
        .replace(
          /<span class="token function">/g,
          `<span style="color:${colors.function}">`,
        )
        .replace(
          /<span class="token operator">/g,
          `<span style="color:${colors.operator}">`,
        )
        .replace(
          /<span class="token[^"]*">/g,
          `<span style="color:${colors.plain}">`,
        );
    }
    return content;
  }, [content, activeFile, colors]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setContent(newValue);
      handleContentChange(newValue);
    },
    [handleContentChange],
  );

  const handleScroll = useCallback(() => {
    if (highlightRef.current && textareaRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  if (!activeFile) {
    return (
      <div className="flex items-center justify-center p-5 h-screen">
        Open a folder (File → Open Folder or Ctrl+O)
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-240px)] h-screen flex flex-col">
      <OpenFilesList
        openFiles={openFiles}
        activeFilePath={activeFilePath}
        onTabClick={setActiveFilePath}
        onCloseTab={handleCloseTab}
      />
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-words overflow-auto pointer-events-none"
          style={{
            backgroundColor: themeStyle.bg,
            color: themeStyle.fg,
            fontFamily:
              themeStyle.fontFamily || "Consolas, 'Courier New', monospace",
          }}
          dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }}
        />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full p-4 resize-none outline-none font-mono text-sm whitespace-pre-wrap break-words bg-transparent text-transparent caret-white"
          style={{
            fontFamily:
              themeStyle.fontFamily || "Consolas, 'Courier New', monospace",
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
