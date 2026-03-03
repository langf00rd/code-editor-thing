import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FileItem } from "../../electron/preload";
import { getTheme } from "./themes";
import type { EditorContextType, OpenFile } from "./types";

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [isElectron, setIsElectron] = useState(false);

  const currentTheme = useMemo(() => getTheme(selectedTheme), [selectedTheme]);

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
      const api = window.electronAPI;
      if (api) {
        api.removeFolderOpened?.(handleFolderOpened);
        api.removeToggleSidebar?.(handleToggleSidebar);
        api.removeToggleTerminal?.(handleToggleTerminal);
      }
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
    setOpenFiles((prev) => {
      const file = prev.find((f) => f.path === activeFilePath);
      if (file) {
        window.electronAPI!.saveFile(activeFilePath, file.content);
        return prev.map((f) =>
          f.path === activeFilePath ? { ...f, modified: false } : f,
        );
      }
      return prev;
    });
  }, [activeFilePath]);

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
        currentTheme,
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
