import { useEditor } from "../lib/editor-context";
import ThemeSelector from "./theme-selector";

export default function InfoBar() {
  const { currentTheme } = useEditor();

  return (
    <div
      className="h-7 px-2 fixed flex items-center justify-between bottom-0 w-full left-0"
      style={{
        backgroundColor: currentTheme.statusbar.bg,
        color: currentTheme.statusbar.fg,
      }}
    >
      <div />
      <ThemeSelector />
    </div>
  );
}
