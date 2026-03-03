import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { EditorView } from "codemirror";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

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

export function createSyntaxHighlighting(syntax: {
  keyword: string;
  string: string;
  comment: string;
  number: string;
  function: string;
  operator: string;
  variable: string;
  type: string;
  property: string;
  bracket: string;
  tag: string;
  attribute: string;
  heading: string;
  emphasis: string;
  strong: string;
  link: string;
}) {
  return syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.keyword, color: syntax.keyword },
      { tag: t.string, color: syntax.string },
      { tag: t.comment, color: syntax.comment, fontStyle: "italic" },
      { tag: t.number, color: syntax.number },
      { tag: t.function(t.variableName), color: syntax.function },
      { tag: t.operator, color: syntax.operator },
      { tag: t.variableName, color: syntax.variable },
      { tag: t.typeName, color: syntax.type },
      { tag: t.propertyName, color: syntax.property },
      { tag: t.bracket, color: syntax.bracket },
      { tag: t.tagName, color: syntax.tag },
      { tag: t.attributeName, color: syntax.attribute },
      { tag: t.heading, color: syntax.heading, fontWeight: "bold" },
      { tag: t.emphasis, color: syntax.emphasis, fontStyle: "italic" },
      { tag: t.strong, color: syntax.strong, fontWeight: "bold" },
      { tag: t.link, color: syntax.link, textDecoration: "underline" },
      { tag: t.bool, color: syntax.number },
      { tag: t.null, color: syntax.number },
      { tag: t.regexp, color: syntax.string },
      { tag: t.escape, color: syntax.number },
      { tag: t.className, color: syntax.type },
      { tag: t.definition(t.variableName), color: syntax.function },
      { tag: t.self, color: syntax.keyword },
      { tag: t.namespace, color: syntax.property },
    ])
  );
}
