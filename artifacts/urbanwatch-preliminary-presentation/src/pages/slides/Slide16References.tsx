import { Frame, Header, Footer } from '../../components/SlideShared';

export default function Slide16References() {
  return (
    <Frame>
      <Header number="16" eyebrow="Sources" title="References" />
      <main className="absolute left-[5vw] right-[5vw] top-[25vh] grid grid-cols-2 gap-x-[3vw] text-[1.5vw] leading-[1.32] text-[#496461]">
        <div className="space-y-[1.25vh]">
          <p><strong className="text-primary">1.</strong> Kummitha et al. “Smart city governance: assessing modes of active citizen engagement.” Regional Studies. doi:10.1080/00343404.2024.2399262.</p>
          <p><strong className="text-primary">2.</strong> Kolotouchkina, Ripoll González &amp; Belabas. “Smart Cities, Digital Inequalities, and the Challenge of Inclusion.” Smart Cities 7(6), 2024.</p>
          <p><strong className="text-primary">3.</strong> Landa Oregi et al. “Enhancing Citizen Participation in Citizen-Centered Smart Cities.” Urban Science 9(5), 2025. doi:10.3390/urbansci9050140.</p>
          <p><strong className="text-primary">4.</strong> Wolniak &amp; Stecuła. “Artificial Intelligence in Smart Cities—Applications, Barriers, and Future Directions.” Smart Cities 7(3), 2024. doi:10.3390/smartcities7030057.</p>
          <p><strong className="text-primary">5.</strong> Karelis et al. “Digital Inclusion and Social Cohesion in Smart Cities: Overcoming Barriers in the Digital Age.” DGO, 2025. doi:10.59490/dgo.2025.987.</p>
        </div>
        <div className="space-y-[1.25vh]">
          <p><strong className="text-accent">6.</strong> Divya, Divyashree &amp; Uma Maheswari. “Pothole detection using YOLOv8 and CNN.” IEEE INOCON, 2024. doi:10.1109/INOCON60754.2024.10512004.</p>
          <p><strong className="text-accent">7.</strong> Vinodhini &amp; Sidhaarth. “Pothole detection in bituminous road using CNN with transfer learning.” Measurement: Sensors 31, 2024. doi:10.1016/j.measen.2023.100940.</p>
          <p><strong className="text-accent">8.</strong> Ruseruka et al. “Augmenting roadway safety with machine learning and deep learning.” Machine Learning with Applications 16, 2024. doi:10.1016/j.mlwa.2024.100547.</p>
          <p><strong className="text-accent">9.</strong> Tang et al. “Pothole detection—you only look once.” IET Image Processing 19(1), 2025; online 2024. doi:10.1049/ipr2.13300.</p>
          <p><strong className="text-accent">10.</strong> Asad et al. “Pothole Detection Using Deep Learning: A Real-Time and AI-on-the-Edge Perspective.” Advances in Civil Engineering, 2022. doi:10.1155/2022/9221211.</p>
        </div>
      </main>
      <Footer text="All ten literature items were verified from publisher, ACM, or IEEE pages." />
    </Frame>
  );
}