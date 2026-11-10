import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink, FlaskConical, GitFork, ShieldCheck, Users } from "lucide-react";
import { bySlug, equipment, type Link as RefLink } from "@/data/equipment";
import { SPRITES } from "@/data/sprites";
import { Difficulty } from "@/components/difficulty";
import { MarkViewed } from "@/components/mark-viewed";
import { PackButton } from "@/components/pack-button";
import { PixelSprite } from "@/components/pixel-sprite";

export function generateStaticParams() {
  return equipment.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gear/[slug]">): Promise<Metadata> {
  const item = bySlug((await params).slug);
  return item ? { title: item.name, description: item.tagline } : {};
}

export default async function GearPage({ params }: PageProps<"/gear/[slug]">) {
  const item = bySlug((await params).slug);
  if (!item) notFound();
  const related = item.related.map(bySlug).filter((e) => e !== undefined);

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <MarkViewed slug={item.slug} />
      <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-gold hover:underline">
        <ArrowLeft size={14} aria-hidden /> Catalog
      </Link>

      <header className="panel mt-4 flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="slot mx-auto h-36 w-36 shrink-0 p-3 sm:mx-0">
          <PixelSprite rows={SPRITES[item.slug]} label={item.name} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-gold">{item.category}</p>
          <h1 className="font-pixel text-4xl">{item.name}</h1>
          <p className="text-parchment/70">{item.manufacturer}</p>
          <p className="mt-3 text-lg">{item.tagline}</p>
          {item.status && <p className="mt-2 text-sm font-semibold text-ember">Status: {item.status}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <PackButton slug={item.slug} />
            <Difficulty level={item.difficulty} />
            <span className="text-sm text-parchment/75">{item.price}</span>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="font-pixel text-2xl">About</h2>
            <p className="mt-2 text-parchment/90">{item.description}</p>
          </section>

          <section className="panel p-5">
            <h2 className="font-pixel text-2xl">Specifications</h2>
            <dl className="mt-3 divide-y-2 divide-ink text-sm">
              {item.specs.map((s) => (
                <div key={s.label} className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-parchment/60">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-4 text-sm font-semibold text-parchment/70">Technologies &amp; protocols</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {item.protocols.map((p) => (
                <li key={p} className="slot px-2 py-0.5 text-xs">
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-parchment/60">
              Summarised from the manufacturer&apos;s documentation. Hardware revisions change: check the{" "}
              <a href={item.docs} className="underline">
                official docs
              </a>{" "}
              before buying or building.
            </p>
          </section>

          <section className="panel p-5">
            <h2 className="flex items-center gap-2 font-pixel text-2xl">
              <FlaskConical size={20} aria-hidden className="text-leaf" /> Projects
            </h2>
            <ul className="mt-3 space-y-3">
              {item.projects.map((p) => (
                <li key={p.title} className="slot p-3">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-parchment/80">{p.summary}</p>
                  <div className="mt-2 text-parchment/80">
                    <Difficulty level={p.difficulty} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <UseList title="Learning" items={item.educational} />
          <UseList title="Defense" items={item.defensive} />
          <UseList title="Authorized testing" items={item.authorized} />
          <p className="flex gap-2 text-xs text-parchment/70">
            <ShieldCheck size={16} aria-hidden className="shrink-0 text-leaf" />
            Practise on equipment you own, in an isolated lab, or with written permission. Radio transmission is
            regulated in most countries.
          </p>

          <section className="panel p-5">
            <h2 className="font-pixel text-2xl">Resources</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <ResourceLink icon={<ExternalLink size={16} aria-hidden />} link={{ label: "Official website", url: item.website }} />
              <ResourceLink icon={<BookOpen size={16} aria-hidden />} link={{ label: "Documentation", url: item.docs }} />
              {item.github.map((g) => (
                <ResourceLink key={g.url} icon={<GitFork size={16} aria-hidden />} link={g} />
              ))}
              {item.community.map((c) => (
                <ResourceLink key={c.url} icon={<Users size={16} aria-hidden />} link={c} />
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section className="panel p-5">
              <h2 className="font-pixel text-2xl">Related gear</h2>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/gear/${r.slug}`} className="slot flex items-center gap-3 p-2 hover:border-gold">
                      <PixelSprite rows={SPRITES[r.slug]} className="h-10 w-10" />
                      <span>
                        <span className="block font-semibold">{r.name}</span>
                        <span className="text-xs text-parchment/65">{r.category}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function UseList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="panel p-5">
      <h2 className="font-pixel text-xl">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

function ResourceLink({ icon, link }: { icon: React.ReactNode; link: RefLink }) {
  return (
    <li>
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold hover:underline">
        {icon} {link.label}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}
