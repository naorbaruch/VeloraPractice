"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Velora
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/tracks"
            className="text-[13px] font-medium text-muted hover:text-foreground transition-colors"
          >
            Tracks
          </Link>
          {loading ? (
            <div className="w-16 h-9" />
          ) : user ? (
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[13px] font-medium text-muted hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-[13px] font-medium px-5 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
