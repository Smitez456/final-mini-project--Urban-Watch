import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide13Timeline() {
  return (
    <Frame>
      <Header number="13" eyebrow="Schedule" title="Project Timeline" />
      <main className="absolute left-[5vw] right-[5vw] top-[31vh]">
        <div className="absolute left-[4vw] right-[4vw] top-[4.2vh] h-[.7vh] rounded-full bg-[#c8d6d1]" />
        <div className="relative grid grid-cols-5 gap-[2vw]">
          <section className="pt-[10vh]">
            <div className="absolute top-[2vh] h-[5vh] w-[5vh] rounded-full border-[.55vh] border-[#f7f3ea] bg-accent" />
            <p className="font-display text-[1.6vw] font-bold text-accent">AUG 2026</p>
            <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Research</h2>
            <p className="mt-[1vh] text-[1.55vw] leading-[1.35] text-muted">Problem framing and literature</p>
          </section>
          <section className="pt-[10vh]">
            <div className="absolute top-[2vh] ml-[.5vw] h-[5vh] w-[5vh] rounded-full border-[.55vh] border-[#f7f3ea] bg-[#d6a45d]" />
            <p className="font-display text-[1.6vw] font-bold text-[#b58130]">AUG 2026</p>
            <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Core build</h2>
            <p className="mt-[1vh] text-[1.55vw] leading-[1.35] text-muted">Auth, reports, Firestore</p>
          </section>
          <section className="pt-[10vh]">
            <div className="absolute top-[2vh] ml-[1vw] h-[5vh] w-[5vh] rounded-full border-[.55vh] border-[#f7f3ea] bg-[#237c72]" />
            <p className="font-display text-[1.6vw] font-bold text-[#237c72]">SEP 2026</p>
            <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Integration</h2>
            <p className="mt-[1vh] text-[1.55vw] leading-[1.35] text-muted">Cloudinary and admin queue</p>
          </section>
          <section className="pt-[10vh]">
            <div className="absolute top-[2vh] ml-[1.4vw] h-[5vh] w-[5vh] rounded-full border-[.55vh] border-[#f7f3ea] bg-primary" />
            <p className="font-display text-[1.6vw] font-bold text-primary">OCT 2026</p>
            <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Validation</h2>
            <p className="mt-[1vh] text-[1.55vw] leading-[1.35] text-muted">Testing and AI exploration</p>
          </section>
          <section className="pt-[10vh]">
            <div className="absolute top-[2vh] ml-[2vw] h-[5vh] w-[5vh] rounded-full border-[.55vh] border-[#f7f3ea] bg-accent" />
            <p className="font-display text-[1.6vw] font-bold text-accent">OCT 2026</p>
            <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Delivery</h2>
            <p className="mt-[1vh] text-[1.55vw] leading-[1.35] text-muted">Evaluation and final report</p>
          </section>
        </div>
      </main>
      <Footer />
    </Frame>
  );
}