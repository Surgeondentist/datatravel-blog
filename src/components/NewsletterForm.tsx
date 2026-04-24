"use client";

import { useId, useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "hero" | "card";

export default function NewsletterForm({ variant = "hero" }: { variant?: Variant }) {
  const emailFieldId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error ?? "Unknown error.");
      }
    });
  }

  if (status === "success") {
    if (variant === "card") {
      return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="font-heading text-base font-semibold text-foreground">You&apos;re subscribed</p>
          <p className="text-center text-sm text-muted-foreground px-4">
            We&apos;ll let you know when we publish new content.
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <CheckCircle2 className="h-7 w-7 text-white" />
        </div>
        <p className="font-heading text-lg font-semibold text-white">You&apos;re subscribed</p>
        <p className="text-sm text-violet-200/70">We&apos;ll let you know when we publish new content.</p>
      </div>
    );
  }

  const inputClass =
    variant === "hero"
      ? "flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-violet-300/50 outline-none backdrop-blur-sm transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400 disabled:opacity-60"
      : "flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60";

  const buttonClass =
    variant === "hero"
      ? "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-900 transition-all hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-lg disabled:opacity-60 cursor-pointer"
      : "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer";

  const errorClass = variant === "hero" ? "text-red-300" : "text-destructive";

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-3 sm:flex-row", variant === "card" && "sm:items-start")}>
      <label htmlFor={emailFieldId} className="sr-only">
        Email address
      </label>
      <input
        id={emailFieldId}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus("idle");
        }}
        placeholder="you@example.com"
        required
        disabled={isPending}
        className={inputClass}
      />
      <button type="submit" disabled={isPending} className={buttonClass}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isPending ? "Sending..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className={cn("w-full text-center text-sm sm:col-span-2", errorClass)}>{message}</p>
      )}
    </form>
  );
}
