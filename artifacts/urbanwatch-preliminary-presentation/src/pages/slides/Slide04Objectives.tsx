import { Frame, Header, Footer, Card, Bullet } from '../../components/SlideShared';

export default function Slide04Objectives() {
  return (
    <Frame>
      <Header number="04" eyebrow="Direction" title="Goals and Objectives" />
      <main className="absolute left-[5vw] right-[5vw] top-[29vh] grid grid-cols-[.9fr_1.1fr] gap-[3vw]">
        <Card title="Primary goal" tone="coral">
          <p className="text-[2.2vw] leading-[1.32]">Develop a usable academic prototype that connects citizen reporting with an administrator review workflow.</p>
        </Card>
        <Card title="Specific objectives" tone="paper">
          <div className="grid grid-cols-2 gap-x-[2vw] gap-y-[1.8vh]">
            <Bullet>Firebase Email/Password authentication.</Bullet>
            <Bullet>Firestore complaint persistence.</Bullet>
            <Bullet>Secure Cloudinary image evidence.</Bullet>
            <Bullet>Status-based complaint tracking.</Bullet>
            <Bullet>Administrator queue and overview.</Bullet>
            <Bullet>Planned GPS and AI assistance.</Bullet>
          </div>
        </Card>
      </main>
      <Footer />
    </Frame>
  );
}