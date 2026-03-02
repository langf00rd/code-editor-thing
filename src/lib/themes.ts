export const THEMES = [
  { id: "vs", name: "Light" },
  { id: "vs-dark", name: "Dark" },
  { id: "github-dark", name: "GitHub Dark" },
  { id: "github-light", name: "GitHub Light" },
  { id: "dracula", name: "Dracula" },
  { id: "monokai", name: "Monokai" },
  { id: "nord", name: "Nord" },
  { id: "one-dark-pro", name: "One Dark Pro" },
  { id: "tokyo-night", name: "Tokyo Night" },
];

export const THEME_STYLES: Record<string, { bg: string; fg: string; fontFamily?: string }> = {
  "vs": { bg: "#ffffff", fg: "#000000" },
  "vs-dark": { bg: "#1e1e1e", fg: "#d4d4d4" },
  "github-dark": { bg: "#0d1117", fg: "#c9d1d9", fontFamily: "Consolas, 'Courier New', monospace" },
  "github-light": { bg: "#ffffff", fg: "#24292e", fontFamily: "Consolas, 'Courier New', monospace" },
  "dracula": { bg: "#282a36", fg: "#f8f8f2" },
  "monokai": { bg: "#272822", fg: "#f8f8f0" },
  "nord": { bg: "#2e3440", fg: "#d8dee9" },
  "one-dark-pro": { bg: "#282c34", fg: "#abb2bf" },
  "tokyo-night": { bg: "#1a1b26", fg: "#a9b1d6" },
};