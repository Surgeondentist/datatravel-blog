"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Megaphone, Users } from "lucide-react";

const tabs = [
  { href: "/admin/comentarios", label: "Comments", icon: MessageSquare },
  { href: "/admin/suscriptores", label: "Subscribers", icon: Users },
  { href: "/admin/amplificar", label: "Amplify", icon: Megaphone },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-5 flex gap-1" aria-label="Admin sections">
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
