import { ThemeConfig } from "./types";

const CODE_FONT =
  "'Geist Mono', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace";

export const THEMES: ThemeConfig[] = [
  {
    id: "vs",
    name: "Light",
    editor: { bg: "#fff", fg: "#000000", fontFamily: CODE_FONT },
    sidebar: { bg: "#fff", fg: "#000000" },
    body: { bg: "#f3f3f3", fg: "#000000" },
    openFilePill: { bg: "#fff", fg: "#8a8a8a" },
    statusbar: { bg: "#fff", fg: "#000" },
  },
  {
    id: "vs-dark",
    name: "Dark",
    editor: { bg: "#1e1e1e", fg: "#d4d4d4", fontFamily: CODE_FONT },
    sidebar: { bg: "#252526", fg: "#cccccc" },
    body: { bg: "#252526", fg: "#cccccc" },
    openFilePill: { bg: "#252526", fg: "#cccccc" },
    statusbar: { bg: "#007acc", fg: "#ffffff" },
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    editor: { bg: "#0d1117", fg: "#c9d1d9", fontFamily: CODE_FONT },
    sidebar: { bg: "#010409", fg: "#c9d1d9" },
    body: { bg: "#010409", fg: "#c9d1d9" },
    openFilePill: { bg: "#010409", fg: "#c9d1d9" },
    statusbar: { bg: "#238636", fg: "#ffffff" },
  },
  {
    id: "github-light",
    name: "GitHub Light",
    editor: { bg: "#ffffff", fg: "#24292e", fontFamily: CODE_FONT },
    sidebar: { bg: "#f6f8fa", fg: "#24292e" },
    body: { bg: "#f6f8fa", fg: "#24292e" },
    openFilePill: { bg: "#f6f8fa", fg: "#24292e" },
    statusbar: { bg: "#0969da", fg: "#ffffff" },
  },
  {
    id: "dracula",
    name: "Dracula",
    editor: { bg: "#282a36", fg: "#f8f8f2", fontFamily: CODE_FONT },
    sidebar: { bg: "#21222c", fg: "#f8f8f2" },
    body: { bg: "#21222c", fg: "#f8f8f2" },
    openFilePill: { bg: "#21222c", fg: "#f8f8f2" },
    statusbar: { bg: "#6272a4", fg: "#f8f8f2" },
  },
  {
    id: "monokai",
    name: "Monokai",
    editor: { bg: "#272822", fg: "#f8f8f0", fontFamily: CODE_FONT },
    sidebar: { bg: "#1e1f1c", fg: "#f8f8f0" },
    body: { bg: "#1e1f1c", fg: "#f8f8f0" },
    openFilePill: { bg: "#1e1f1c", fg: "#f8f8f0" },
    statusbar: { bg: "#75715d", fg: "#f8f8f0" },
  },
  {
    id: "nord",
    name: "Nord",
    editor: { bg: "#2e3440", fg: "#d8dee9", fontFamily: CODE_FONT },
    sidebar: { bg: "#3b4252", fg: "#d8dee9" },
    body: { bg: "#3b4252", fg: "#d8dee9" },
    openFilePill: { bg: "#3b4252", fg: "#d8dee9" },
    statusbar: { bg: "#88c0d0", fg: "#2e3440" },
  },
  {
    id: "one-dark-pro",
    name: "One Dark Pro",
    editor: { bg: "#282c34", fg: "#abb2bf", fontFamily: CODE_FONT },
    sidebar: { bg: "#21252b", fg: "#abb2bf" },
    body: { bg: "#21252b", fg: "#abb2bf" },
    openFilePill: { bg: "#21252b", fg: "#abb2bf" },
    statusbar: { bg: "#c678dd", fg: "#ffffff" },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    editor: { bg: "#1a1b26", fg: "#a9b1d6", fontFamily: CODE_FONT },
    sidebar: { bg: "#16161e", fg: "#a9b1d6" },
    body: { bg: "#16161e", fg: "#a9b1d6" },
    openFilePill: { bg: "#16161e", fg: "#a9b1d6" },
    statusbar: { bg: "#7aa2f7", fg: "#1a1b26" },
  },
];

export function getTheme(id: string): ThemeConfig {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
