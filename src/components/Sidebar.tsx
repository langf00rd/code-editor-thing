import { useState } from "react";
import { useEditor } from "../lib/editor-context";
import { THEMES } from "../lib/themes";
import ThemeSelector from "./theme-selector";
import type { FileItem } from "../../electron/preload";

interface TreeItemProps {
  item: FileItem;
  level: number;
}

function TreeItem({ item, level }: TreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<FileItem[]>([]);
  const { handleFileSelect } = useEditor();

  const handleClick = async () => {
    if (item.isDirectory) {
      if (!expanded) {
        const items = await window.electronAPI.readDirectory(item.path);
        setChildren(items.filter((i: FileItem) => !i.name.startsWith(".")));
      }
      setExpanded(!expanded);
    } else {
      handleFileSelect(item);
    }
  };

  return (
    <div>
      <div
        className={`flex h-7 items-center cursor-pointer hover:bg-neutral-100 ${
          item.isDirectory ? "text-[#000]" : "text-black/50"
        }`}
        style={{ paddingLeft: `${10 + level * 15}px` }}
        onClick={handleClick}
      >
        <span className="mr-1">
          {item.isDirectory ? (expanded ? "-" : "+") : ""}
        </span>
        <span className="text-[12px] whitespace-nowrap">{item.name}</span>
      </div>
      {expanded && item.isDirectory && (
        <>
          {children.map((child) => (
            <TreeItem key={child.path} item={child} level={level + 1} />
          ))}
        </>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { fileTree, selectedTheme, setSelectedTheme } = useEditor();

  return (
    <div className="h-full p-1 py-2 bg-neutral-100 border-r w-[240px]">
      {fileTree.map((item) => (
        <TreeItem key={item.path} item={item} level={0} />
      ))}
      <div className="h-6 border-t">
        <ThemeSelector
          themes={THEMES}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
        />
      </div>
    </div>
  );
}
