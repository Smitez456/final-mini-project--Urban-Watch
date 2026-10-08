import { Frame, Header, Footer, Card } from '../../components/SlideShared';

export default function Slide06Scope() {
  return (
    <Frame>
      <Header number="06" eyebrow="Boundaries" title="Project Scope and Target Group" />
      <main className="absolute left-[5vw] right-[5vw] top-[28vh] grid grid-cols-[1.2fr_.8fr] gap-[3vw]">
        <section className="grid grid-cols-2 gap-[2vw]">
          <Card title="In scope" tone="mint">
            <p>Account registration and login</p>
            <p className="mt-[1.2vh]">Complaint form and image upload</p>
            <p className="mt-[1.2vh]">Firestore record creation</p>
            <p className="mt-[1.2vh]">Tracking and admin views</p>
          </Card>
          <Card title="Planned / limited" tone="paper">
            <p>GPS-assisted location capture</p>
            <p className="mt-[1.2vh]">AI-assisted category suggestions</p>
            <p className="mt-[1.2vh]">Municipal integrations</p>
            <p className="mt-[1.2vh]">Production-scale moderation</p>
          </Card>
        </section>
        <Card title="Target group" tone="coral">
          <p className="text-[2.2vw] font-bold">Primary</p>
          <p className="mt-[1vh]">Residents reporting local civic issues.</p>
          <p className="mt-[2.5vh] text-[2.2vw] font-bold">Secondary</p>
          <p className="mt-[1vh]">Municipal reviewers, ward officers, and public-works teams.</p>
        </Card>
      </main>
      <Footer />
    </Frame>
  );
}