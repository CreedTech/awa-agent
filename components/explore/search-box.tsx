"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface SearchBoxProps {
  initial: string;
  placeholder: string;
  onSubmit: (q: string) => void;
}

/** Remount with `key={initial}` so back/forward navigation resets the text. */
export function SearchBox({ initial, placeholder, onSubmit }: SearchBoxProps) {
  const [text, setText] = useState(initial);
  return (
    <form
      className="aw-searchbox"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(text.trim());
      }}
    >
      <Icon name="search" size={18} />
      <label className="sr-only" htmlFor="explore-q">Search homes</label>
      <input
        id="explore-q"
        type="search"
        value={text}
        placeholder={placeholder}
        onChange={(event) => setText(event.target.value)}
        enterKeyHint="search"
      />
    </form>
  );
}
