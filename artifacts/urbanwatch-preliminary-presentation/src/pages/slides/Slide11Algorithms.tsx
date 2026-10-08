import { Frame, Header, Footer, Card } from '../../components/SlideShared';

export default function Slide11Algorithms() {
  return (
    <Frame>
      <Header number="11" eyebrow="Logic" title="Algorithms Used" />
      <main className="absolute left-[5vw] right-[5vw] top-[29vh] grid grid-cols-2 gap-[2.2vw]">
        <Card title="Implemented application logic" tone="mint">
          <p><strong>Authentication gate:</strong> verify Firebase session before protected actions.</p>
          <p className="mt-[1.5vh]"><strong>Validation pipeline:</strong> type, signature, size, and HTTPS checks.</p>
          <p className="mt-[1.5vh]"><strong>Complaint retrieval:</strong> user-specific query or administrator collection query.</p>
          <p className="mt-[1.5vh]"><strong>Status grouping:</strong> Submitted → In Review → Assigned → Resolved.</p>
        </Card>
        <Card title="Planned AI assistance" tone="dark">
          <p><strong>Image classification:</strong> transfer-learning CNN / YOLO family model.</p>
          <p className="mt-[1.5vh]"><strong>Text processing:</strong> keyword and semantic category suggestions.</p>
          <p className="mt-[1.5vh]"><strong>Priority scoring:</strong> issue type, safety impact, and duplicate signals.</p>
          <p className="mt-[2vh] font-bold text-[#efb979]">Human review remains authoritative.</p>
        </Card>
      </main>
      <Footer />
    </Frame>
  );
}