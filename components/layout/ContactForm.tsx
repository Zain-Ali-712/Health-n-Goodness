"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { Field } from "@/components/forms/Field";
import { BRANCHES } from "@/lib/branches";
import { PHONE_FIELD } from "@/lib/forms";

const TOPICS = ["General question", "Live Juice Bar booking", "Fruit basket order", "Feedback on an order"];

/** Front-end only: validates, then shows a confirmation. Nothing is sent anywhere. */
export function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] bg-surface p-8"
          role="status"
        >
          <CheckCircleIcon className="size-10 text-green" weight="fill" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em]">Thanks, {sent}.</h2>
          <p className="mt-2 max-w-[40ch] text-ink-soft">This is a demo, so your message stayed in your browser. On the live site the team would reply by phone or email.</p>
          <button type="button" className="btn btn-ghost mt-6" onClick={() => setSent(null)}>
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={false}
          exit={{ opacity: 0, y: -8 }}
          className="grid gap-4 rounded-[1.75rem] bg-surface p-6 md:grid-cols-2 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setSent(String(fd.get("name")).trim().split(" ")[0] || "friend");
          }}
        >
          <Field name="name" label="Your name" autoComplete="name" required minLength={2} error="Please enter your name." />
          <Field name="phone" label="Mobile number" required {...PHONE_FIELD} />
          <Field name="email" type="email" label="Email (optional)" autoComplete="email" error="Enter a valid email, like you@example.com." className="md:col-span-2" />
          <div className="field grid gap-1.5">
            <label htmlFor="topic" className="text-sm font-medium">
              Topic
            </label>
            <select id="topic" name="topic" defaultValue={TOPICS[0]}>
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field grid gap-1.5">
            <label htmlFor="branch" className="text-sm font-medium">
              Branch
            </label>
            <select id="branch" name="branch" defaultValue="">
              <option value="">Any branch</option>
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field grid gap-1.5 md:col-span-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea id="message" name="message" rows={5} required minLength={10} aria-errormessage="message-err" />
            <span id="message-err" className="field-error">
              Tell us a little more (at least 10 characters).
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <p className="text-xs text-muted-ink">Demo form. Nothing is sent.</p>
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
