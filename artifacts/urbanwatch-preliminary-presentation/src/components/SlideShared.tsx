import type { ReactNode } from 'react';

export const base = import.meta.env.BASE_URL;

export function Frame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`relative h-screen w-screen overflow-hidden font-body ${dark ? 'bg-[#143b40] text-[#f7f3ea]' : 'bg-[linear-gradient(135deg,#fbf8f1_0%,#f1ecdf_100%)] text-[#183e42]'}`}>
      <div className="absolute left-[4.5vw] top-[3.5vh] h-[0.7vh] w-[8vw] rounded-full bg-accent" />
      <div className="absolute right-[-4vw] top-[-8vh] h-[28vh] w-[16vw] rotate-12 rounded-[4vw] bg-[#d9e9e4]/50" />
      {children}
    </div>
  );
}

export function Header({ number, eyebrow, title, dark = false }: { number: string; eyebrow: string; title: string; dark?: boolean }) {
  return (
    <header className="absolute left-[5vw] right-[5vw] top-[5.5vh]">
      <div className={`font-display text-[1.5vw] font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#efb979]' : 'text-accent'}`}>
        {number} / {eyebrow}
      </div>
      <h1 className={`mt-[1.8vh] max-w-[84vw] font-display text-[4.2vw] font-bold leading-[1.02] tracking-[-0.055em] ${dark ? 'text-[#fffaf0]' : 'text-primary'}`}>
        {title}
      </h1>
    </header>
  );
}

export function Footer({ text = 'UrbanWatch · Preliminary Presentation · 03 September 2026' }: { text?: string }) {
  return (
    <div className="absolute bottom-[3.2vh] left-[5vw] right-[5vw] flex items-center justify-between border-t border-[#9cb0ab]/45 pt-[1.5vh] text-[1.5vw] text-muted">
      <span>{text}</span>
      <span className="font-display font-bold text-accent">ACADEMIC PROTOTYPE</span>
    </div>
  );
}

export function Card({ title, children, tone = 'paper' }: { title: string; children: ReactNode; tone?: 'paper' | 'mint' | 'coral' | 'dark' }) {
  const tones = {
    paper: 'border-[#d8d2c4] bg-[#fffdf8] text-[#183e42]',
    mint: 'border-[#b9d8cf] bg-[#e4f1ed] text-[#183e42]',
    coral: 'border-[#df6654] bg-[#ef735e] text-[#fffaf0]',
    dark: 'border-[#2b5c62] bg-[#143b40] text-[#fffaf0]',
  };
  return (
    <section className={`rounded-[1.5vw] border p-[2vw] ${tones[tone]}`}>
      <h2 className="font-display text-[2vw] font-bold leading-tight">{title}</h2>
      <div className="mt-[1.6vh] text-[1.75vw] leading-[1.35]">{children}</div>
    </section>
  );
}

export function Bullet({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className="flex gap-[1vw]">
      <span className={`mt-[1.15vh] h-[0.7vw] w-[0.7vw] shrink-0 rotate-45 ${light ? 'bg-[#efb979]' : 'bg-accent'}`} />
      <p className={light ? 'text-[#d7e6e0]' : 'text-[#496461]'}>{children}</p>
    </div>
  );
}