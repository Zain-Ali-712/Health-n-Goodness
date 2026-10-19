"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Labelled input with hint and an error that shows only after interaction (:user-invalid). */
export function Field({
  label,
  hint,
  error,
  className = "",
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error: string; name: string }) {
  const id = `${useId()}-${input.name}`;
  return (
    <div className={cn("field grid gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        spellCheck={input.type === "email" ? false : undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        aria-errormessage={`${id}-err`}
        {...input}
      />
      {hint && (
        <span id={`${id}-hint`} className="text-xs text-muted-ink">
          {hint}
        </span>
      )}
      <span id={`${id}-err`} className="field-error">
        {error}
      </span>
    </div>
  );
}
