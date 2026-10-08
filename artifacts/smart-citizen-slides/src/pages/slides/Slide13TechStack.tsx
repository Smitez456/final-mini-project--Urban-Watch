export default function Slide13TechStack() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#1A1B26', fontFamily: "'Inter', sans-serif", display: 'flex', color: '#C0CAF5', position: 'relative' }}>
      {/* Sidebar */}
      <div style={{ width: '22vw', minWidth: '22vw', height: '100vh', backgroundColor: '#16161E', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '5vh 2.5vw', display: 'flex', flexDirection: 'column', flexShrink: 0, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw', marginBottom: '4vh' }}>
          <div style={{ width: '1.6vw', height: '1.6vw', backgroundColor: '#7AA2F7', borderRadius: '0.35vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '0.7vw', height: '0.7vw', backgroundColor: '#1A1B26', borderRadius: '0.12vw' }} />
          </div>
          <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FFFFFF' }}>SmartCitizen</div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Overview</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Literature</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Problem</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Design</div>
        <div style={{ marginBottom: '2.5vh' }}>
          <div style={{ fontSize: '0.75vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2vh' }}>Technical</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', paddingLeft: '0.3vw' }}>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Technology Stack
            </div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Requirements</div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Results</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>Technical Specifications</div>
        <h1 style={{ fontSize: '3.8vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Technology Stack</h1>
        <div style={{ display: 'flex', gap: '3vw', flex: 1 }}>
          {/* Column 1 */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5vw', overflow: 'hidden' }}>
              <div style={{ display: 'flex', padding: '1.2vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ flex: 1, fontSize: '0.8vw', fontWeight: 700, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Component</div>
                <div style={{ flex: 1, fontSize: '0.8vw', fontWeight: 700, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Technology</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Frontend</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9ECE6A', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Flutter (Dart)</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Backend</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9ECE6A', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Firebase</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Database</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9ECE6A', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Cloud Firestore</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Authentication</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9ECE6A', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Firebase Auth</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Image Storage</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9ECE6A', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Firebase Storage</div>
              </div>
            </div>
          </div>
          {/* Column 2 */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5vw', overflow: 'hidden' }}>
              <div style={{ display: 'flex', padding: '1.2vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ flex: 1, fontSize: '0.8vw', fontWeight: 700, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Component</div>
                <div style={{ flex: 1, fontSize: '0.8vw', fontWeight: 700, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Technology</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Maps &amp; GPS</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#E0AF68', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Google Maps API</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>AI / ML</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#E0AF68', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>TensorFlow / ML Kit</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Languages</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#E0AF68', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Dart, Python</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw', borderBottom: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Dev Tools</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#E0AF68', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Android Studio, VS Code</div>
              </div>
              <div style={{ display: 'flex', padding: '1.3vh 1.5vw' }}>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#9AA5CE' }}>Version Control</div>
                <div style={{ flex: 1, fontSize: '1.1vw', color: '#E0AF68', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>Git &amp; GitHub</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>13</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
