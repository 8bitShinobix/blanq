import { BlanqLogoLockup } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-grey-200 bg-blanq-white">
      <div className="mx-auto flex h-[100px] max-w-6xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:justify-between">
        <BlanqLogoLockup size={24} variant="dark" />
        <p className="text-sm text-grey-400">
          &copy; {new Date().getFullYear()} Blanq. Open source and free.
        </p>
      </div>
    </footer>
  );
}
