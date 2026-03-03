import { FileItem } from "electron/preload";

export interface OpenFile {
  path: string;
  name: string;
  content: string;
  modified: boolean;
}

export interface Theme {
  id: string;
  name: string;
}

export interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export interface OpenFilesListProps {
  openFiles: OpenFile[];
  activeFilePath: string | null;
  onTabClick: (path: string) => void;
  onCloseTab: (path: string) => void;
}

export interface ThemeConfig {
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
  body?: {
    bg: string;
    fg: string;
  };
  openFilePill?: {
    bg: string;
    fg: string;
  };
  syntax: {
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
  };
}

export interface EditorContextType {
  sidebarVisible: boolean;
  setSidebarVisible: (v: boolean) => void;
  terminalVisible: boolean;
  setTerminalVisible: (v: boolean) => void;
  fileTree: FileItem[];
  setFileTree: (v: FileItem[]) => void;
  openFiles: OpenFile[];
  setOpenFiles: (v: OpenFile[]) => void;
  activeFilePath: string | null;
  setActiveFilePath: (v: string | null) => void;
  currentFolder: string | null;
  setCurrentFolder: (v: string | null) => void;
  selectedTheme: string;
  setSelectedTheme: (v: string) => void;
  currentTheme: ThemeConfig;
  isElectron: boolean;
  handleFileSelect: (item: FileItem) => Promise<void>;
  handleContentChange: (content: string) => void;
  handleSave: () => Promise<void>;
  handleCloseTab: (path: string) => void;
  handleRefreshTree: (folderPath: string) => Promise<void>;
}
