import { Frame, Header, Footer, Card, Bullet } from '../../components/SlideShared';

export default function Slide02Motivation() {
  return (
    <Frame>
      <Header number="02" eyebrow="Context" title="Motivation" />
      <main className="absolute left-[5vw] right-[5vw] top-[28vh] grid grid-cols-[1.08fr_.92fr] gap-[3vw]">
        <section className="rounded-[1.8vw] bg-primary p-[3vw] text-[#fffaf0]">
          <p className="font-display text-[4.4vw] font-bold leading-[1.02] tracking-[-.055em]">A civic problem is visible long before it enters a formal system.</p>
          <p className="mt-[3vh] text-[1.85vw] leading-[1.4] text-[#d7e6e0]">Potholes, waste, broken lights, and damaged public spaces often remain scattered across calls, messages, and social posts.</p>
        </section>
        <Card title="Why UrbanWatch" tone="mint">
          <div className="space-y-[2vh]">
            <Bullet>Give citizens one structured reporting channel.</Bullet>
            <Bullet>Attach visual evidence and a clear location.</Bullet>
            <Bullet>Make status visible after submission.</Bullet>
            <Bullet>Help administrators review issues in one queue.</Bullet>
          </div>
        </Card>
      </main>
      <Footer />
    </Frame>
  );
}