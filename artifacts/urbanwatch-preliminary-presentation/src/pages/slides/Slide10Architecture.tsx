import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide10Architecture() {
  return (
    <Frame>
      <Header number="10" eyebrow="Design" title="Architecture / Block Diagram" />
      <main className="absolute left-[5vw] right-[5vw] top-[31vh]">
        <div className="flex items-center justify-between gap-[1vw]">
          <section className="w-[16vw] rounded-[1.2vw] bg-[#ef735e] p-[1.8vw] text-center text-[#fffaf0]">
            <p className="font-display text-[2.1vw] font-bold">Citizen</p>
            <p className="mt-[1vh] text-[1.55vw]">Browser / mobile web</p>
          </section>
          <p className="font-display text-[3vw] font-bold text-[#d6a45d]">→</p>
          <section className="w-[18vw] rounded-[1.2vw] bg-primary p-[1.8vw] text-center text-[#fffaf0]">
            <p className="font-display text-[2.1vw] font-bold">React App</p>
            <p className="mt-[1vh] text-[1.55vw]">Report and track</p>
          </section>
          <p className="font-display text-[3vw] font-bold text-[#d6a45d]">→</p>
          <section className="w-[18vw] rounded-[1.2vw] bg-[#e4f1ed] p-[1.8vw] text-center">
            <p className="font-display text-[2.1vw] font-bold text-[#237c72]">Firebase</p>
            <p className="mt-[1vh] text-[1.55vw]">Auth + Firestore</p>
          </section>
          <p className="font-display text-[3vw] font-bold text-[#d6a45d]">↔</p>
          <section className="w-[18vw] rounded-[1.2vw] bg-[#fffdf8] p-[1.8vw] text-center">
            <p className="font-display text-[2.1vw] font-bold text-primary">Admin View</p>
            <p className="mt-[1vh] text-[1.55vw]">Queue and status</p>
          </section>
        </div>
        <div className="ml-[26vw] mt-[4vh] flex w-[49vw] items-center gap-[1.5vw] border-t-[.4vh] border-dashed border-[#9cb0ab] pt-[2.5vh]">
          <section className="w-[21vw] rounded-[1.2vw] bg-[#d6a45d] p-[1.6vw] text-center text-[#143b40]">
            <p className="font-display text-[1.9vw] font-bold">Express Upload API</p>
            <p className="mt-[.8vh] text-[1.5vw]">Validates Firebase token + file</p>
          </section>
          <p className="font-display text-[3vw] font-bold text-[#ef735e]">→</p>
          <section className="w-[19vw] rounded-[1.2vw] bg-[#143b40] p-[1.6vw] text-center text-[#fffaf0]">
            <p className="font-display text-[1.9vw] font-bold">Cloudinary</p>
            <p className="mt-[.8vh] text-[1.5vw]">Returns HTTPS image URL</p>
          </section>
        </div>
      </main>
      <Footer />
    </Frame>
  );
}