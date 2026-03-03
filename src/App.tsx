import { useEffect } from "react";
import Editor from "./components/editor";
import Sidebar from "./components/sidebar";
import Terminal from "./components/Terminal";
import { EditorProvider, useEditor } from "./lib/editor-context";

function EditorApp() {
  const {
    isElectron,
    handleSave,
    currentTheme,
    sidebarVisible,
    terminalVisible,
  } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  if (!isElectron) {
    return (
      <div className="flex h-screen bg-[#1e1e1e] text-[#d4d4d4] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Code Editor</h1>
          <p>Please run this app in Electron to use all features.</p>
          <p className="mt-2 text-gray-500">
            Run: npm run dev && node start-electron.cjs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen gap-2 w-screen"
      style={{
        backgroundColor: currentTheme.body?.bg,
        color: currentTheme.body?.fg,
      }}
    >
      {sidebarVisible && <Sidebar />}
      <div className="h-full flex flex-col">
        <Editor />
        {terminalVisible && <Terminal />}
      </div>
    </div>
  );
}

function App() {
  return (
    <EditorProvider>
      <EditorApp />
    </EditorProvider>
  );
}

export default App;
