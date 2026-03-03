import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { EditorView } from "codemirror";

export function getLanguageExtension(filename: string) {
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

export function createThemeExtension(bg: string, fg: string) {
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
