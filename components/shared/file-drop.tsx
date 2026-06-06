"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";

interface FileDropProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
}

/** A real file picker styled as a dropzone; shows the selected file names. */
export function FileDrop({ label, accept, multiple = true, onFiles }: FileDropProps) {
  const id = useId();
  const [names, setNames] = useState<string[]>([]);

  return (
    <div className="col gap-2">
      <label
        htmlFor={id}
        className="row gap-2 center"
        style={{ border: "1.5px dashed var(--line-2)", borderRadius: 12, padding: 18, color: "var(--muted)", fontSize: 13.5, cursor: "pointer" }}
      >
        <Icon name="upload" size={18} /> {label}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (!files.length) return;
          setNames(files.map((f) => f.name));
          onFiles?.(files);
        }}
      />
      {names.length > 0 && (
        <div className="row wrap gap-2">
          {names.map((n, i) => (
            <span key={`${n}-${i}`} className="tag tag-ok">
              <Icon name="check" size={12} strokeWidth={2.4} /> {n.length > 24 ? n.slice(0, 22) + "..." : n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
