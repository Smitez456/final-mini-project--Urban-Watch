import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide05Risks() {
  return (
    <Frame>
      <Header number="05" eyebrow="Planning" title="Assumptions and Risks" />
      <main className="absolute left-[5vw] right-[5vw] top-[27vh] grid grid-cols-2 gap-[2.5vw]">
        <section className="rounded-[1.5vw] bg-[#e4f1ed] p-[2.4vw]">
          <h2 className="font-display text-[2.3vw] font-bold text-[#237c72]">Assumptions</h2>
          <div className="mt-[2vh] space-y-[1.4vh] text-[1.7vw] leading-[1.35] text-[#496461]">
            <p>Citizens have internet access and a camera-enabled device.</p>
            <p>Municipal staff review a shared issue queue.</p>
            <p>Submitted locations and descriptions are substantially accurate.</p>
            <p>The prototype is evaluated in a limited academic environment.</p>
          </div>
        </section>
        <section className="rounded-[1.5vw] bg-primary p-[2.4vw] text-[#fffaf0]">
          <h2 className="font-display text-[2.3vw] font-bold text-[#efb979]">Key risks and controls</h2>
          <div className="mt-[2vh] space-y-[1.4vh] text-[1.7vw] leading-[1.35] text-[#d7e6e0]">
            <p><strong className="text-[#fffaf0]">False or duplicate reports:</strong> future moderation and deduplication.</p>
            <p><strong className="text-[#fffaf0]">Sensitive image content:</strong> file validation and access rules.</p>
            <p><strong className="text-[#fffaf0]">AI misclassification:</strong> human review remains authoritative.</p>
            <p><strong className="text-[#fffaf0]">Service dependency:</strong> Firebase and Cloudinary availability.</p>
          </div>
        </section>
      </main>
      <Footer />
    </Frame>
  );
}