import { useEditor } from "../lib/editor-context";
import ThemeSelector from "./theme-selector";

export default function InfoBar() {
  const { currentTheme } = useEditor();

  return (
    <div
      className="h-[28px] w-full"
      style={{
        backgroundColor: currentTheme.body?.bg,
      }}
    >
      <div
        className="w-full px-2 text-[11px] h-full rounded-md flex items-center justify-between"
        style={{
          backgroundColor: currentTheme.statusbar.bg,
          color: currentTheme.statusbar.fg,
        }}
      >
        <ThemeSelector />
      </div>
    </div>
  );
}
