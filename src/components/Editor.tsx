import { createThemeExtension, getLanguageExtension } from "@/lib/utils";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";
import { useEffect, useRef } from "react";
import { useEditor } from "../lib/editor-context";
import { OpenFiles } from "./open-files";

export default function Editor() {
  const {
    openFiles,
    activeFilePath,
    setActiveFilePath,
    handleCloseTab,
    handleContentChange,
    currentTheme,
  } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  useEffect(() => {
    if (!editorRef.current || !activeFile) return;
    if (viewRef.current) viewRef.current.destroy();
    const langExt = getLanguageExtension(activeFile.name);
    const extensions: any[] = [
      basicSetup,
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      createThemeExtension(currentTheme.editor.bg, currentTheme.editor.fg),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          handleContentChange(update.state.doc.toString());
        }
      }),
    ];

    if (langExt) {
      extensions.push(langExt);
    }

    const state = EditorState.create({
      doc: activeFile.content,
      extensions,
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [
    activeFilePath,
    activeFile?.name,
    currentTheme.editor.bg,
    currentTheme.editor.fg,
  ]);

  if (!activeFile) {
    return (
      <div className="flex items-center justify-center p-5 w-[50vw] h-screen">
        <p className="opacity-40 text-xl">
          Open a folder (File → Open Folder or Ctrl+O)
        </p>
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-240px)] space-y-2 py-2 pb-0 pr-2 h-screen flex flex-col">
      <OpenFiles
        openFiles={openFiles}
        onTabClick={setActiveFilePath}
        onCloseTab={handleCloseTab}
        currentTheme={currentTheme}
        activeFilePath={activeFilePath}
      />
      <div ref={editorRef} className="h-full rounded-tl-2xl overflow-hidden" />
    </div>
  );
}
