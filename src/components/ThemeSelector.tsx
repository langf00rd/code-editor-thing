interface Theme {
  id: string
  name: string
}

interface ThemeSelectorProps {
  themes: Theme[]
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export default function ThemeSelector({ themes, selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <span className="text-[12px] text-[#bbbbbb]">Theme:</span>
      <select
        value={selectedTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        className="bg-[#3c3c3c] text-[#d4d4d4] text-[12px] px-2 py-1 rounded border-none outline-none cursor-pointer"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}
