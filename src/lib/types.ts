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
