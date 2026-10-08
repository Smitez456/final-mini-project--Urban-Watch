import { Frame, Header, Footer, Bullet } from '../../components/SlideShared';

export default function Slide14Conclusion() {
  return (
    <Frame dark>
      <Header number="14" eyebrow="Summary" title="Conclusion" dark />
      <main className="absolute left-[5vw] right-[5vw] top-[31vh] grid grid-cols-[1.1fr_.9fr] gap-[5vw]">
        <p className="font-display text-[4.1vw] font-bold leading-[1.05] tracking-[-.05em] text-[#fffaf0]">
          UrbanWatch connects credible citizen evidence with a traceable municipal workflow.
        </p>
        <div className="space-y-[2vh] text-[1.85vw] leading-[1.4]">
          <Bullet light>The prototype already supports Firebase sign-in and Firestore complaints.</Bullet>
          <Bullet light>Images are securely routed through the backend to Cloudinary.</Bullet>
          <Bullet light>GPS and AI remain clearly scoped as future academic work.</Bullet>
          <Bullet light>Evaluation will focus on usability, report quality, and workflow clarity.</Bullet>
        </div>
      </main>
      <Footer text="Next: implementation evidence from the running UrbanWatch application." />
    </Frame>
  );
}