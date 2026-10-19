"use client";

import { useEffect } from "react";

/**
 * Keeps aria-invalid in step with the visual :user-invalid state, so screen
 * readers hear about an error only after the user has interacted with a field.
 */
export function FormAria() {
  useEffect(() => {
    if (!CSS.supports("selector(:user-invalid)")) return;
    const sync = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!el.matches?.("input, select, textarea")) return;
      if (e.type === "input" && el.getAttribute("aria-invalid") !== "true") return;
      if (el.matches(":user-invalid")) el.setAttribute("aria-invalid", "true");
      else el.removeAttribute("aria-invalid");
    };
    document.addEventListener("blur", sync, true);
    document.addEventListener("input", sync, true);
    document.addEventListener("change", sync, true);
    return () => {
      document.removeEventListener("blur", sync, true);
      document.removeEventListener("input", sync, true);
      document.removeEventListener("change", sync, true);
    };
  }, []);
  return null;
}
