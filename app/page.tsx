import Image from "next/image";
import { site } from "@/content/site";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-6">
      <section aria-labelledby="hero-heading" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-orange-800">{site.hero.eyebrow}</p>
          <h1 id="hero-heading" className="max-w-xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">{site.hero.heading}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-600">{site.hero.text}</p>
          <a href="#approach" className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700">{site.hero.action} <span aria-hidden="true">↗</span></a>
        </div>
        <Image src="/images/starter.svg" alt="An orange sun above sculptural arches and a green hillside" width={600} height={640} priority className="h-auto w-full rounded-3xl" />
      </section>
      <section id="approach" tabIndex={-1} aria-labelledby="approach-heading" className="border-t border-stone-200 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-800">Our approach</p>
        <h2 id="approach-heading" className="mt-3 text-3xl font-semibold tracking-tight">Good things start with the essentials.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {site.features.map((feature, index) => <article key={feature.title}>
            <p className="text-sm text-orange-800">0{index + 1}</p>
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-3 leading-relaxed text-stone-600">{feature.text}</p>
          </article>)}
        </div>
      </section>
      <section id="about" tabIndex={-1} aria-labelledby="about-heading" className="mb-16 rounded-3xl bg-stone-200/60 p-8 md:p-12">
        <h2 id="about-heading" className="text-3xl font-semibold tracking-tight">A little space. A lot of possibility.</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-600">We believe a good website begins with a clear idea and a human touch. This is a place for both. Take a look around, then make the next chapter your own.</p>
      </section>
    </main>
  );
}
