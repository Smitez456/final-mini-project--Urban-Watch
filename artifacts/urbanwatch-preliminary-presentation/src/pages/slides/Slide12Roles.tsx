import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide12Roles() {
  return (
    <Frame>
      <Header number="12" eyebrow="Team" title="Roles Assigned" />
      <main className="absolute left-[5vw] right-[5vw] top-[29vh] grid grid-cols-3 gap-[1.5vw]">
        <section className="rounded-[1.5vw] bg-primary p-[2vw] text-[#fffaf0]">
          <p className="font-display text-[3vw] font-bold text-[#ef735e]">01</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Mark Sumesh Paul</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#d7e6e0]">Frontend UI, accessibility, responsive layouts, documentation and presentation</p>
        </section>
        <section className="rounded-[1.5vw] bg-[#e4f1ed] p-[2vw]">
          <p className="font-display text-[3vw] font-bold text-[#237c72]">02</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Patrick John Paul</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#496461]">Firebase authentication, Firestore data model and literature survey</p>
        </section>
        <section className="rounded-[1.5vw] bg-[#fffdf8] p-[2vw]">
          <p className="font-display text-[3vw] font-bold text-[#d6a45d]">03</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Steve Sumesh Paul</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#496461]">Backend API, Cloudinary upload, security validation and testing</p>
        </section>
      </main>
      <Footer />
    </Frame>
  );
}