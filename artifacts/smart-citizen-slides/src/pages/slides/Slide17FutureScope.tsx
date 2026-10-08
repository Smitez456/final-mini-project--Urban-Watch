export default function Slide17FutureScope() {
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
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Technical</div>
        <div style={{ marginBottom: '2.5vh' }}>
          <div style={{ fontSize: '0.75vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2vh' }}>Results</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', paddingLeft: '0.3vw' }}>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Expected Outcomes</div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Applications</div>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Future Scope
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>Expected Results</div>
        <h1 style={{ fontSize: '3.8vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2.5vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Future Scope</h1>
        <p style={{ fontSize: '1.2vw', color: '#9AA5CE', lineHeight: 1.6, maxWidth: '56vw', margin: '0 0 3vh 0' }}>The proposed system can be enhanced with advanced technologies in the future to expand capabilities and reach.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vw', flex: 1 }}>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(122,162,247,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#7AA2F7', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.01</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Voice-based complaint reporting</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(122,162,247,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#7AA2F7', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.02</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Multilingual support</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#9ECE6A', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.03</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Integration with IoT sensors</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#9ECE6A', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.04</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Predictive maintenance using AI</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(224,175,104,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#E0AF68', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.05</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Real-time analytics dashboard</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(224,175,104,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#E0AF68', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.06</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Integration with government portals</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,158,100,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.07</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>Web application for authorities</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,158,100,0.15)', borderRadius: '0.5vw', padding: '2vh 2vw', display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace", minWidth: '2.5vw', paddingTop: '0.2vh' }}>F.08</div>
            <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.45 }}>AI chatbot for citizen assistance</div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>17</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
