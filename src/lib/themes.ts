export interface Theme {
  id: string;
  name: string;
  editor: {
    bg: string;
    fg: string;
    fontFamily?: string;
  };
  sidebar: {
    bg: string;
    fg: string;
  };
  statusbar: {
    bg: string;
    fg: string;
  };
}

const CODE_FONT = "'Geist Mono', 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace";

export const THEMES: Theme[] = [
  {
    id: "vs",
    name: "Light",
    editor: { bg: "#ffffff", fg: "#000000", fontFamily: CODE_FONT },
    sidebar: { bg: "#f3f3f3", fg: "#000000" },
    statusbar: { bg: "#007acc", fg: "#ffffff" },
  },
  {
    id: "vs-dark",
    name: "Dark",
    editor: { bg: "#1e1e1e", fg: "#d4d4d4", fontFamily: CODE_FONT },
    sidebar: { bg: "#252526", fg: "#cccccc" },
    statusbar: { bg: "#007acc", fg: "#ffffff" },
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    editor: { bg: "#0d1117", fg: "#c9d1d9", fontFamily: CODE_FONT },
    sidebar: { bg: "#010409", fg: "#c9d1d9" },
    statusbar: { bg: "#238636", fg: "#ffffff" },
  },
  {
    id: "github-light",
    name: "GitHub Light",
    editor: { bg: "#ffffff", fg: "#24292e", fontFamily: CODE_FONT },
    sidebar: { bg: "#f6f8fa", fg: "#24292e" },
    statusbar: { bg: "#0969da", fg: "#ffffff" },
  },
  {
    id: "dracula",
    name: "Dracula",
    editor: { bg: "#282a36", fg: "#f8f8f2", fontFamily: CODE_FONT },
    sidebar: { bg: "#21222c", fg: "#f8f8f2" },
    statusbar: { bg: "#6272a4", fg: "#f8f8f2" },
  },
  {
    id: "monokai",
    name: "Monokai",
    editor: { bg: "#272822", fg: "#f8f8f0", fontFamily: CODE_FONT },
    sidebar: { bg: "#1e1f1c", fg: "#f8f8f0" },
    statusbar: { bg: "#75715d", fg: "#f8f8f0" },
  },
  {
    id: "nord",
    name: "Nord",
    editor: { bg: "#2e3440", fg: "#d8dee9", fontFamily: CODE_FONT },
    sidebar: { bg: "#3b4252", fg: "#d8dee9" },
    statusbar: { bg: "#88c0d0", fg: "#2e3440" },
  },
  {
    id: "one-dark-pro",
    name: "One Dark Pro",
    editor: { bg: "#282c34", fg: "#abb2bf", fontFamily: CODE_FONT },
    sidebar: { bg: "#21252b", fg: "#abb2bf" },
    statusbar: { bg: "#c678dd", fg: "#ffffff" },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    editor: { bg: "#1a1b26", fg: "#a9b1d6", fontFamily: CODE_FONT },
    sidebar: { bg: "#16161e", fg: "#a9b1d6" },
    statusbar: { bg: "#7aa2f7", fg: "#1a1b26" },
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[1];
}
