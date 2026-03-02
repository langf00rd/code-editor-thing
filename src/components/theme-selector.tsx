import { useEditor } from "@/lib/editor-context";
import { THEMES } from "@/lib/themes";

export default function ThemeSelector() {
  const { selectedTheme, setSelectedTheme } = useEditor();
  return (
    <select
      value={selectedTheme}
      onChange={(e) => setSelectedTheme(e.target.value)}
      className="px-2 w-md py-1 bg-transparent rounded border-none outline-none cursor-pointer"
    >
      {THEMES.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.name}
        </option>
      ))}
    </select>
  );
}
