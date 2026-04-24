"use client";

import { useState, useTransition } from "react";
import { Mail, Loader2, Send } from "lucide-react";
import { enviarNewsletter } from "@/app/actions/newsletter-send";

export default function NewsletterBroadcastForm() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    setMessage(null);
    if (!confirm("Send this email to all confirmed subscribers?")) return;
    startTransition(async () => {
      const result = await enviarNewsletter(subject, html);
      if ("error" in result) {
        setMessage({ text: result.error, ok: false });
        return;
      }
      setMessage({ text: `Sent to ${result.sent} subscriber(s).`, ok: true });
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-lg font-bold text-foreground">Email subscribers</h2>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Sends one message per subscriber via Resend (batches of 100). Use HTML for formatting (e.g.{" "}
        <code className="rounded bg-muted px-1 text-xs">&lt;p&gt;</code>,{" "}
        <code className="rounded bg-muted px-1 text-xs">&lt;a href&gt;</code>). Requires{" "}
        <code className="rounded bg-muted px-1 text-xs">RESEND_API_KEY</code> and verified domain in Resend.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="broadcast-subject" className="mb-1.5 block text-sm font-medium text-foreground">
            Subject
          </label>
          <input
            id="broadcast-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
            placeholder="What is new on Redshell"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label htmlFor="broadcast-html" className="mb-1.5 block text-sm font-medium text-foreground">
            HTML body
          </label>
          <textarea
            id="broadcast-html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={14}
            placeholder={'<p>Hello — here is our latest update.</p>\n<p><a href="https://redshell.cloud/blog">Read the blog</a></p>'}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
            {message.text}
          </p>
        )}

        <button
          type="button"
          onClick={handleSend}
          disabled={isPending || !subject.trim() || !html.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isPending ? "Sending…" : "Send to all subscribers"}
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Resend also offers <strong className="font-medium text-foreground">Broadcasts</strong> in their dashboard for
        lists stored in Resend. Your subscribers live in Supabase—this form uses your app + API key instead.
      </p>
    </div>
  );
}
