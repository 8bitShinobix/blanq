import Link from "next/link";
import { BlanqLogoLockup } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[200] w-full border-b border-grey-200/60 bg-blanq-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <BlanqLogoLockup size={28} variant="dark" />
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="#features"
            className="hidden text-sm font-medium text-grey-500 transition-colors hover:text-blanq-black sm:block"
          >
            Features
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-grey-500 transition-colors hover:text-blanq-black"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-dark"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
