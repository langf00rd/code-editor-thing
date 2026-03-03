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
}
