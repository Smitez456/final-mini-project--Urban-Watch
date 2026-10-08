import { Frame, Header, Footer, base } from '../../components/SlideShared';

export default function Slide15Evidence() {
  return (
    <Frame>
      <Header number="15" eyebrow="Implementation" title="Code Snippets / Screenshots" />
      <main className="absolute left-[4vw] right-[4vw] top-[25vh] grid grid-cols-[1.05fr_.95fr] gap-[2vw]">
        <section className="grid grid-cols-3 gap-[.8vw]">
          <figure>
            <img src={`${base}urbanwatch-dashboard.jpg`} crossOrigin="anonymous" alt="UrbanWatch dashboard screen" className="h-[20vh] w-full rounded-[1vw] border border-[#b7c8c3] object-cover" />
            <figcaption className="mt-[.8vh] text-[1.1vw] font-bold text-[#237c72]">Dashboard</figcaption>
          </figure>
          <figure>
            <img src={`${base}urbanwatch-login.jpg`} crossOrigin="anonymous" alt="UrbanWatch Firebase login screen" className="h-[20vh] w-full rounded-[1vw] border border-[#b7c8c3] object-cover" />
            <figcaption className="mt-[.8vh] text-[1.1vw] font-bold text-[#237c72]">Firebase Email/Password</figcaption>
          </figure>
          <figure>
            <img src={`${base}urbanwatch-report.jpg`} crossOrigin="anonymous" alt="UrbanWatch protected report issue page" className="h-[20vh] w-full rounded-[1vw] border border-[#b7c8c3] object-cover" />
            <figcaption className="mt-[.8vh] text-[1.1vw] font-bold text-[#237c72]">Report Issue page</figcaption>
          </figure>
          <figure className="col-span-2">
            <img src={`${base}urbanwatch-frontend-code.svg`} crossOrigin="anonymous" alt="UrbanWatch frontend React source code showing five key Firebase and complaint submission code snippets" className="h-[20vh] w-full rounded-[1vw] border border-[#b7c8c3] object-cover" />
            <figcaption className="mt-[.8vh] text-[1.1vw] font-bold text-[#237c72]">5 frontend code snippets · Auth + report submission</figcaption>
          </figure>
        </section>
        <section className="space-y-[1vh]">
          <div className="rounded-[1vw] bg-primary p-[1vw] text-[#d7e6e0]">
            <h2 className="font-display text-[1.55vw] font-bold text-[#efb979]">01 · Firebase login</h2>
            <pre className="mt-[.6vh] whitespace-pre-wrap font-mono text-[1vw] leading-[1.22]">{`await signInWithEmailAndPassword(
  firebaseAuth, email.trim(), password
);`}</pre>
          </div>
          <div className="rounded-[1vw] bg-[#e4f1ed] p-[1vw] text-primary">
            <h2 className="font-display text-[1.55vw] font-bold text-[#237c72]">02 · Authenticated upload</h2>
            <pre className="mt-[.6vh] whitespace-pre-wrap font-mono text-[1vw] leading-[1.22]">{`const imageUrl = imageFile
  ? await uploadImageToCloudinary(
      imageFile, await user.getIdToken())
  : null;`}</pre>
          </div>
          <div className="rounded-[1vw] bg-[#fffdf8] p-[1vw] text-primary">
            <h2 className="font-display text-[1.55vw] font-bold text-primary">03 · Backend session check</h2>
            <pre className="mt-[.6vh] whitespace-pre-wrap font-mono text-[1vw] leading-[1.22]">{`if (!hasValidFirebaseSession(
  req.headers.authorization,
)) {
  res.status(401).json({ error: 'Sign in first.' });
  return;
}`}</pre>
          </div>
        </section>
      </main>
      <Footer />
    </Frame>
  );
}