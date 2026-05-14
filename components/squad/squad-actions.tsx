"use client";

import { useState } from "react";
import { UserSearch } from "lucide-react";
import { AddPlayerModal } from "./add-player-modal";

export function SquadActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all"
        style={{
          background: "rgba(82,222,229,0.12)",
          border: "1px solid rgba(82,222,229,0.35)",
          color: "var(--accent)",
          letterSpacing: "0.04em",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(82,222,229,0.2)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,222,229,0.55)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(82,222,229,0.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(82,222,229,0.12)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,222,229,0.35)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        <UserSearch className="h-3.5 w-3.5" aria-hidden="true" />
        Adicionar Jogador
      </button>

      {open && <AddPlayerModal onClose={() => setOpen(false)} />}
    </>
  );
}

