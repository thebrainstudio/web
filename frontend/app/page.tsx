/**
 * Phase 1 placeholder home page. Verifies:
 *   - Persistent BrainStage renders behind content
 *   - SmoothScroll (Lenis) feels velvet
 *   - Fonts load (Fraunces display + Inter body)
 *   - Palette tokens resolve (brass on navy)
 *
 * Phase 4 replaces this with the 5-shot scroll cinema.
 */
export default function Home() {
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-[42rem] text-center">
          <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
            The Brain Studio
          </p>
          <h1 className="font-display text-bone-cream mt-8 text-balance text-4xl leading-[1.05] md:text-6xl">
            There is a model that predicts <br className="hidden md:inline" />
            what your brain will do.
          </h1>
          <p className="text-bone-cream/70 mx-auto mt-10 max-w-[34rem] text-base leading-[1.65] md:text-lg">
            An experiment in seeing the mind through a brain-encoding model.
            Three rooms — language, music, and the limits of translation —
            coming together over the next sessions.
          </p>
          <p className="text-bone-cream/40 mt-16 text-xs uppercase tracking-[0.32em]">
            Scroll
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-[40rem]">
          <p className="text-brass font-display text-xs uppercase tracking-[0.36em]">
            Phase 1
          </p>
          <h2 className="font-display text-bone-cream mt-6 text-3xl leading-[1.1] md:text-5xl">
            Foundation laid.
          </h2>
          <p className="text-bone-cream/70 mt-8 text-base leading-[1.65] md:text-lg">
            The persistent 3D stage is wired. Smooth scroll is breathing. The
            type system is set. From here, the brain itself, then the
            scroll-as-camera system, then the home cinema.
          </p>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-10 text-center text-xs uppercase tracking-[0.28em] text-bone-cream/40">
        Built at Chulalongkorn JIPP · TRIBE v2 encoder
      </footer>
    </>
  );
}
