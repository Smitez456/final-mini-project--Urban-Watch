import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide03Problem() {
  return (
    <Frame>
      <Header number="03" eyebrow="Definition" title="Problem Statement" />
      <main className="absolute left-[5vw] right-[5vw] top-[30vh]">
        <div className="grid grid-cols-3 gap-[2vw]">
          <section className="border-t-[.8vh] border-accent bg-[#fffdf8] p-[2.2vw]">
            <p className="font-display text-[4.5vw] font-bold text-accent">01</p>
            <h2 className="mt-[1vh] font-display text-[2.1vw] font-bold">Fragmented intake</h2>
            <p className="mt-[1.6vh] text-[1.75vw] leading-[1.4] text-[#5f736f]">Reports arrive through disconnected channels with inconsistent details.</p>
          </section>
          <section className="border-t-[.8vh] border-[#d6a45d] bg-[#fffdf8] p-[2.2vw]">
            <p className="font-display text-[4.5vw] font-bold text-[#d6a45d]">02</p>
            <h2 className="mt-[1vh] font-display text-[2.1vw] font-bold">Weak traceability</h2>
            <p className="mt-[1.6vh] text-[1.75vw] leading-[1.4] text-[#5f736f]">Citizens may not know whether an issue was received, assigned, or resolved.</p>
          </section>
          <section className="border-t-[.8vh] border-[#237c72] bg-[#fffdf8] p-[2.2vw]">
            <p className="font-display text-[4.5vw] font-bold text-[#237c72]">03</p>
            <h2 className="mt-[1vh] font-display text-[2.1vw] font-bold">Manual triage</h2>
            <p className="mt-[1.6vh] text-[1.75vw] leading-[1.4] text-[#5f736f]">Unstructured descriptions make category and urgency decisions slower.</p>
          </section>
        </div>
        <p className="mt-[2vh] max-w-[84vw] font-display text-[2vw] font-bold leading-[1.25] text-primary">
          UrbanWatch investigates whether a single web workflow can improve report quality, evidence handling, and status visibility for both citizens and municipal teams.
        </p>
      </main>
      <Footer />
    </Frame>
  );
}