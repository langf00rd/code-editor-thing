import { OpenFile, ThemeConfig } from "@/lib/types";
import { XIcon } from "lucide-react";

export function OpenFiles(props: {
  openFiles: OpenFile[];
  onTabClick: (path: string) => void;
  onCloseTab: (path: string) => void;
  currentTheme: ThemeConfig;
  activeFilePath: string | null;
}) {
  return (
    <>
      {props.openFiles.length > 0 && (
        <div className="flex gap-2 h-[25px]">
          {props.openFiles.map((file) => (
            <div
              onClick={() => props.onTabClick(file.path)}
              key={file.path}
              className={`flex items-center gap-2 text-[12px] rounded-md px-3 cursor-pointer hover:opacity-50`}
              style={{
                backgroundColor:
                  file.path === props.activeFilePath
                    ? "var(--colors-transparent)"
                    : props.currentTheme.openFilePill?.bg,
                color: props.currentTheme.openFilePill?.fg,
              }}
            >
              <p className="whitespace-nowrap">
                {file.name}
                {file.modified && <span className="text-[#569cd6]"> ●</span>}
              </p>
              <span
                className="opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onCloseTab(file.path);
                }}
              >
                <XIcon size={12} />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
