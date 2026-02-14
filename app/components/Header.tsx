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
    <header className="border-b border-border">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Velora
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/tracks"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Tracks
          </Link>
          {loading ? (
            <div className="w-16 h-8" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-light transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
