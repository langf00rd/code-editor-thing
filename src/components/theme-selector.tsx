import { useEditor } from "@/lib/editor-context";
import { THEMES } from "@/lib/themes";
import { Paintbrush } from "lucide-react";

export default function ThemeSelector() {
  const { selectedTheme, setSelectedTheme } = useEditor();
  return (
    <span className="flex items-center">
      <Paintbrush size={12} />
      <select
        value={selectedTheme}
        onChange={(e) => setSelectedTheme(e.target.value)}
        className="px-2 w-md py-1 bg-transparent rounded outline-none cursor-pointer"
      >
        {THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </span>
  );
}
