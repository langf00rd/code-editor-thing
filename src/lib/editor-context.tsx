import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FileItem } from "../../electron/preload";
import type { OpenFile } from "./types";

interface EditorContextType {
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
  isElectron: boolean;
  handleFileSelect: (item: FileItem) => Promise<void>;
  handleContentChange: (content: string) => void;
  handleSave: () => Promise<void>;
  handleCloseTab: (path: string) => void;
  handleRefreshTree: (folderPath: string) => Promise<void>;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(!!window.electronAPI);

    if (!window.electronAPI) return;

    const handleFolderOpened = async (folderPath: string) => {
      setCurrentFolder(folderPath);
      const items = await window.electronAPI!.readDirectory(folderPath);
      setFileTree(items.filter((item) => !item.name.startsWith(".")));
    };

    const handleToggleSidebar = () => {
      setSidebarVisible((prev) => !prev);
    };

    const handleToggleTerminal = () => {
      setTerminalVisible((prev) => !prev);
    };

    window.electronAPI.onFolderOpened(handleFolderOpened);
    window.electronAPI.onToggleSidebar(handleToggleSidebar);
    window.electronAPI.onToggleTerminal(handleToggleTerminal);

    return () => {
      window.electronAPI.removeFolderOpened?.(handleFolderOpened);
      window.electronAPI.removeToggleSidebar?.(handleToggleSidebar);
      window.electronAPI.removeToggleTerminal?.(handleToggleTerminal);
    };
  }, []);

  const handleFileSelect = useCallback(
    async (item: FileItem) => {
      if (item.isDirectory) return;

      const existing = openFiles.find((f) => f.path === item.path);
      if (existing) {
        setActiveFilePath(item.path);
        return;
      }

      if (!window.electronAPI) return;
      const content = await window.electronAPI.readFile(item.path);
      const newFile: OpenFile = {
        path: item.path,
        name: item.name,
        content,
        modified: false,
      };
      setOpenFiles((prev) => [...prev, newFile]);
      setActiveFilePath(item.path);
    },
    [openFiles],
  );

  const handleContentChange = useCallback(
    (content: string) => {
      if (!activeFilePath) return;
      setOpenFiles((prev) =>
        prev.map((f) =>
          f.path === activeFilePath ? { ...f, content, modified: true } : f,
        ),
      );
    },
    [activeFilePath],
  );

  const handleSave = useCallback(async () => {
    if (!activeFilePath || !window.electronAPI) return;
    const file = openFiles.find((f) => f.path === activeFilePath);
    if (!file) return;

    await window.electronAPI.saveFile(activeFilePath, file.content);
    setOpenFiles((prev) =>
      prev.map((f) =>
        f.path === activeFilePath ? { ...f, modified: false } : f,
      ),
    );
  }, [activeFilePath, openFiles]);

  const handleCloseTab = useCallback(
    (path: string) => {
      setOpenFiles((prev) => prev.filter((f) => f.path !== path));
      if (activeFilePath === path) {
        setActiveFilePath(null);
      }
    },
    [activeFilePath],
  );

  const handleRefreshTree = useCallback(async (folderPath: string) => {
    if (!window.electronAPI) return;
    const items = await window.electronAPI.readDirectory(folderPath);
    setFileTree(items.filter((item) => !item.name.startsWith(".")));
  }, []);

  return (
    <EditorContext.Provider
      value={{
        sidebarVisible,
        setSidebarVisible,
        terminalVisible,
        setTerminalVisible,
        fileTree,
        setFileTree,
        openFiles,
        setOpenFiles,
        activeFilePath,
        setActiveFilePath,
        currentFolder,
        setCurrentFolder,
        selectedTheme,
        setSelectedTheme,
        isElectron,
        handleFileSelect,
        handleContentChange,
        handleSave,
        handleCloseTab,
        handleRefreshTree,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
