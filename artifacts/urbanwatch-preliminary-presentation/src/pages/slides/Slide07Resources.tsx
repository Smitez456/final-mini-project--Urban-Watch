import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide07Resources() {
  return (
    <Frame>
      <Header number="07" eyebrow="Delivery" title="Resources Needed" />
      <main className="absolute left-[5vw] right-[5vw] top-[30vh] grid grid-cols-4 gap-[1.6vw]">
        <section className="rounded-[1.5vw] bg-primary p-[2vw] text-[#fffaf0]">
          <p className="font-display text-[3.8vw] font-bold text-[#ef735e]">FE</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Frontend</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#d7e6e0]">React, TypeScript, Vite, Tailwind CSS</p>
        </section>
        <section className="rounded-[1.5vw] bg-[#e4f1ed] p-[2vw]">
          <p className="font-display text-[3.8vw] font-bold text-[#237c72]">DB</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Data services</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#496461]">Firebase Authentication, Firestore</p>
        </section>
        <section className="rounded-[1.5vw] bg-[#fffdf8] p-[2vw]">
          <p className="font-display text-[3.8vw] font-bold text-[#d6a45d]">API</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Backend</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#496461]">Node.js, Express, authenticated upload route</p>
        </section>
        <section className="rounded-[1.5vw] bg-[#ef735e] p-[2vw] text-[#fffaf0]">
          <p className="font-display text-[3.8vw] font-bold text-[#fffaf0]">IMG</p>
          <h2 className="mt-[1vh] font-display text-[2vw] font-bold">Media</h2>
          <p className="mt-[2vh] text-[1.65vw] leading-[1.4] text-[#ffe5dd]">Cloudinary secure HTTPS image storage</p>
        </section>
      </main>
      <Footer text="Resources include developer laptops, browsers, internet access, and test image data." />
    </Frame>
  );
}