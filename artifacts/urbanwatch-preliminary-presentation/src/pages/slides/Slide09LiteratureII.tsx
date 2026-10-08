import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide09LiteratureII() {
  return (
    <Frame>
      <Header number="09" eyebrow="Evidence" title="Literature Survey II" />
      <main className="absolute left-[3.5vw] right-[3.5vw] top-[23vh]">
        <div className="grid grid-cols-[1.45fr_1fr_1fr_1.15fr_1fr_1fr] gap-[.15vw] bg-[#b8c7c2] text-[1.1vw] leading-[1.14]">
          <div className="bg-primary p-[.7vw] font-bold text-[#fffaf0]">Paper Title</div>
          <div className="bg-primary p-[.7vw] font-bold text-[#fffaf0]">Authors</div>
          <div className="bg-primary p-[.7vw] font-bold text-[#fffaf0]">Venue + Year</div>
          <div className="bg-primary p-[.7vw] font-bold text-[#fffaf0]">Method</div>
          <div className="bg-primary p-[.7vw] font-bold text-[#fffaf0]">Advantages</div>
          <div className="bg-primary p-[.7vw] font-bold text-[#fffaf0]">Disadvantages</div>

          <div className="bg-[#fffdf8] p-[.65vw] font-bold">Pothole detection using YOLOv8 and CNN</div>
          <div className="bg-[#fffdf8] p-[.65vw]">M. Divya; G. Divyashree; B. Uma Maheswari</div>
          <div className="bg-[#fffdf8] p-[.65vw]">IEEE INOCON, 2024</div>
          <div className="bg-[#fffdf8] p-[.65vw]">YOLOv8 object detection + CNN</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Real-time localization</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Needs varied training images</div>

          <div className="bg-[#f2eee4] p-[.65vw] font-bold">Pothole detection in bituminous road using CNN with transfer learning</div>
          <div className="bg-[#f2eee4] p-[.65vw]">K. A. Vinodhini; K. R. A. Sidhaarth</div>
          <div className="bg-[#f2eee4] p-[.65vw]">Measurement: Sensors, 2024</div>
          <div className="bg-[#f2eee4] p-[.65vw]">Transfer learning + CNN</div>
          <div className="bg-[#f2eee4] p-[.65vw]">Reported 96% accuracy</div>
          <div className="bg-[#f2eee4] p-[.65vw]">No new field dataset</div>

          <div className="bg-[#fffdf8] p-[.65vw] font-bold">Augmenting roadway safety with ML and DL</div>
          <div className="bg-[#fffdf8] p-[.65vw]">C. Ruseruka et al.</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Machine Learning with Applications, 2024</div>
          <div className="bg-[#fffdf8] p-[.65vw]">YOLOv5 + dimension estimation</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Detects size and location</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Vehicle-camera dependence</div>

          <div className="bg-[#f2eee4] p-[.65vw] font-bold">Pothole detection—you only look once</div>
          <div className="bg-[#f2eee4] p-[.65vw]">P. Tang; M. Lv; Z. Ding; W. Xu; M. Jiang</div>
          <div className="bg-[#f2eee4] p-[.65vw]">IET Image Processing, 2025; online 2024</div>
          <div className="bg-[#f2eee4] p-[.65vw]">YOLO + deformable convolution</div>
          <div className="bg-[#f2eee4] p-[.65vw]">Handles irregular shapes</div>
          <div className="bg-[#f2eee4] p-[.65vw]">Higher model complexity</div>

          <div className="bg-[#fffdf8] p-[.65vw] font-bold">Pothole Detection Using Deep Learning: A Real-Time and AI-on-the-Edge Perspective</div>
          <div className="bg-[#fffdf8] p-[.65vw]">M. H. Asad et al.</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Advances in Civil Engineering, 2022</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Edge-ready deep learning comparison</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Real-time deployment focus</div>
          <div className="bg-[#fffdf8] p-[.65vw]">Older datasets and hardware limits</div>

        </div>
      </main>
      <Footer />
    </Frame>
  );
}