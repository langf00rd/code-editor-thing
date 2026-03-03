import { ChevronDown, ChevronUp, FolderClosed, FolderOpen } from "lucide-react";
import { useState } from "react";
import type { FileItem } from "../../electron/preload";
import { useEditor } from "../lib/editor-context";

interface TreeItemProps {
  item: FileItem;
  level: number;
}

function TreeItem({ item, level }: TreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<FileItem[]>([]);
  const { handleFileSelect, currentTheme } = useEditor();

  const handleClick = async () => {
    if (item.isDirectory) {
      if (!expanded) {
        const items = await window.electronAPI?.readDirectory(item.path);
        if (items) {
          setChildren(items.filter((i: FileItem) => !i.name.startsWith(".")));
        }
      }
      setExpanded(!expanded);
    } else {
      handleFileSelect(item);
    }
  };

  return (
    <div>
      <div
        className="flex h-7 items-center cursor-pointer"
        style={{
          paddingLeft: `${10 + level * 15}px`,
          color: item.isDirectory
            ? currentTheme.sidebar.fg
            : `${currentTheme.sidebar.fg}80`,
          backgroundColor: "transparent",
        }}
        onClick={handleClick}
      >
        <span className="mr-2">
          {item.isDirectory ? (
            expanded ? (
              <span className="flex items-center gap-2">
                <ChevronUp size={14} className="opacity-30" />
                <FolderOpen size={14} className="opacity-30" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ChevronDown size={14} className="opacity-30" />
                <FolderClosed size={14} className="opacity-30" />
              </span>
            )
          ) : (
            ""
          )}
        </span>
        <p className="whitespace-nowrap select-none">{item.name}</p>
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
  const { fileTree, currentTheme } = useEditor();

  return (
    <div className="py-2 pl-2">
      <section
        className="h-full rounded-xl p-1 py-2 min-w-[260px] overflow-x-scroll"
        style={{
          backgroundColor: currentTheme.sidebar.bg,
          color: currentTheme.sidebar.fg,
        }}
      >
        {fileTree.map((item) => (
          <TreeItem key={item.path} item={item} level={0} />
        ))}
      </section>
    </div>
  );
}
