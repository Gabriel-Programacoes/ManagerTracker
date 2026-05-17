"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type SelectOption = { value: string; label: string };

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
}

export function CustomSelect({ id, value, onChange, options }: CustomSelectProps) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const selected          = options.find((o) => o.value === value);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }} id={id}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
        style={{
          background: "var(--background)",
          border: `1px solid ${open ? "var(--accent)" : "var(--panel-border-strong)"}`,
          boxShadow: open ? "0 0 0 3px var(--accent-glow)" : "none",
          borderRadius: "8px",
          color: "var(--foreground)",
          fontSize: "0.8125rem",
          fontFamily: "inherit",
          padding: "0.5rem 0.75rem",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
          minHeight: "36px",
        }}
      >
        <span>{selected?.label ?? "—"}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", color: "var(--muted-dim)" }}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              zIndex: 50,
              background: "var(--panel-bg)",
              border: "1px solid var(--panel-border-strong)",
              borderRadius: "10px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
              overflow: "hidden",
              maxHeight: "260px",
              overflowY: "auto",
              transformOrigin: "top",
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors"
                  style={{
                    background: isSelected ? "rgba(82,222,229,0.08)" : "transparent",
                    color: isSelected ? "var(--accent)" : "var(--foreground)",
                    fontSize: "0.8125rem",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--divider)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

