"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/tasks"
              className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors"
            >
              Automate Work
            </Link>
            
            <div className="flex space-x-6">
              <Link
                href="/tasks"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-accent text-accent-foreground"
              >
                Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
