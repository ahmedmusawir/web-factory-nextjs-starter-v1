"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  return (
    <header className="border-b border-stone-200" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <a href="#main" className="text-xl font-bold tracking-tight" onClick={() => setOpen(false)}>{site.name}<span className="text-orange-700">.</span></a>
        <button ref={button} type="button" aria-expanded={open} aria-controls="primary-navigation" className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold md:hidden" onClick={() => setOpen(!open)}>
          {open ? "Close menu" : "Open menu"}
        </button>
        <nav id="primary-navigation" aria-label="Primary" className={`${open ? "flex" : "hidden"} w-full flex-col gap-5 border-t border-stone-200 pt-5 md:flex md:w-auto md:flex-row md:border-0 md:pt-0`}>
          {site.navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-1 text-sm font-semibold underline-offset-4 hover:underline">{item.label}</a>)}
        </nav>
      </div>
    </header>
  );
}
