"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterForm() {
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        placeholder="you@example.com"
        required
        disabled={isPending}
        className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-violet-300/50 outline-none backdrop-blur-sm transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-900 transition-all hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-lg disabled:opacity-60 cursor-pointer"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isPending ? "Sending..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="w-full text-center text-sm text-red-300 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
