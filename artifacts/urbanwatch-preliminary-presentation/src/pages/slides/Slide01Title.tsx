import { Frame, base } from '../../components/SlideShared';

export default function Slide01Title() {
  return (
    <Frame dark>
      <img src={`${base}urbanwatch-login.jpg`} crossOrigin="anonymous" alt="UrbanWatch application login screen" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,59,64,.97)_0%,rgba(20,59,64,.90)_48%,rgba(20,59,64,.28)_100%)]" />
      <div className="absolute left-[5vw] top-[7vh] font-display text-[1.6vw] font-bold uppercase tracking-[0.18em] text-[#efb979]">
        Preliminary Project Presentation · 03 September 2026
      </div>
      <div className="absolute left-[5vw] top-[24vh] w-[66vw]">
        <p className="font-display text-[2vw] font-bold text-[#ef735e]">URBANWATCH</p>
        <h1 className="mt-[2vh] font-display text-[5.8vw] font-bold leading-[.98] tracking-[-0.065em] text-[#fffaf0]">
          AI-Powered Smart Citizen Assistant for Civic Issue Reporting
        </h1>
        <p className="mt-[3vh] max-w-[55vw] text-[2vw] leading-[1.35] text-[#d7e6e0]">
          A web-based academic prototype for structured reporting, evidence capture, complaint tracking, and municipal review.
        </p>
      </div>
      <div className="absolute bottom-[6vh] left-[5vw] right-[5vw] grid grid-cols-3 gap-[3vw] border-t border-[#89a7a2]/50 pt-[2.5vh] text-[1.55vw] text-[#d7e6e0]">
        <p><strong className="text-[#fffaf0]">Presented by:</strong> Mark Sumesh Paul, Patrick John Paul, Steve Sumesh Paul</p>
        <p><strong className="text-[#fffaf0]">Project Guide</strong> Mrs. Gracemol Thankachan</p>
        <p><strong className="text-[#fffaf0]">Department:</strong> CU</p>
      </div>
    </Frame>
  );
}