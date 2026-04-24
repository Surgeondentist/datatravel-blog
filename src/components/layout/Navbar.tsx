"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Cpu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "@/components/layout/UserMenu";

const navLinks = [
  { href: "/blog", label: "Artículos" },
  { href: "/blog?category=tecnologia", label: "Tecnología" },
  { href: "/blog?category=inteligencia-artificial", label: "IA" },
  { href: "/blog?category=ciberseguridad", label: "Ciberseguridad" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
      aria-label="Cambiar tema"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Cpu className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-semibold tracking-tight text-foreground">
            Blog<span className="text-primary">tech</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger aria-label={open ? "Cerrar menú" : "Abrir menú"} className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary cursor-pointer">
              {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12 bg-background">
              <nav className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-base text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
