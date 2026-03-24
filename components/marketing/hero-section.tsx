import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:py-28 lg:py-36">
      {/* Left illustrations — chaos / effort (desktop only) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Document scramble — top left */}
        <div
          className="absolute -left-4 top-8 w-280px xl:left-8 xl:w-[320px]"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <Image
            src="/document.png"
            alt="Person scrambling with papers"
            width={320}
            height={320}
            className="-rotate-6 opacity-90"
          />
        </div>

        {/* Coffee cup — bottom left */}
        <div
          className="absolute -left-2 bottom-4 w-[220px] xl:left-16 xl:w-[260px]"
          style={{ animation: "floatSlow 7s ease-in-out 1s infinite" }}
        >
          <Image
            src="/cup.png"
            alt="Person carrying overflowing coffee cup"
            width={260}
            height={260}
            className="rotate-4 opacity-80"
          />
        </div>
      </div>

      {/* Right illustrations — calm / fresh (desktop only) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Reading — top right */}
        <div
          className="absolute -right-4 top-12 w-[260px] xl:right-8 xl:w-[300px]"
          style={{ animation: "floatSlow 6.5s ease-in-out 0.5s infinite" }}
        >
          <Image
            src="/reading.png"
            alt="Person calmly reading on a chair"
            width={300}
            height={300}
            className="rotate-3 opacity-90"
          />
        </div>

        {/* Empty box — bottom right */}
        <div
          className="absolute -right-2 bottom-8 w-[220px] xl:right-16 xl:w-[250px]"
          style={{ animation: "float 7.5s ease-in-out 1.5s infinite" }}
        >
          <Image
            src="/Empty.png"
            alt="Person with an empty box — fresh start"
            width={250}
            height={250}
            className="-rotate-3 opacity-80"
          />
        </div>
      </div>

      {/* Mobile illustration strip — top */}
      <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
        <div className="w-[120px] -rotate-6 sm:w-[150px]">
          <Image
            src="/document.png"
            alt="Person scrambling with papers"
            width={150}
            height={150}
          />
        </div>
        <div className="w-[100px] rotate-4 sm:w-[130px]">
          <Image
            src="/cup.png"
            alt="Person carrying overflowing coffee cup"
            width={130}
            height={130}
          />
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-light tracking-tight text-blanq-black sm:text-5xl md:text-6xl">
          Start with Blanq.
        </h1>
        <p className="mx-auto mt-6 max-w-lg font-body text-lg text-grey-500">
          Beautiful forms. Zero effort. Create stunning, branded forms in
          minutes — no design skills needed.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-accent px-6 py-3 font-body text-base font-medium text-white transition-all duration-200 hover:bg-accent-dark"
          >
            Get Started — it&apos;s free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-grey-200 px-6 py-3 font-body text-base font-medium text-grey-600 transition-all duration-200 hover:border-grey-300 hover:bg-grey-100"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Mobile illustration strip — bottom */}
      <div className="mt-8 flex items-center justify-center gap-2 lg:hidden">
        <div className="w-[120px] rotate-3 sm:w-[150px]">
          <Image
            src="/reading.png"
            alt="Person calmly reading"
            width={150}
            height={150}
          />
        </div>
        <div className="w-[100px] -rotate-3 sm:w-[130px]">
          <Image
            src="/Empty.png"
            alt="Person with empty box"
            width={130}
            height={130}
          />
        </div>
      </div>
    </section>
  );
}
