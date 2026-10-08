export default function Slide03ExistingSystem() {
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
        <div style={{ marginBottom: '2.5vh' }}>
          <div style={{ fontSize: '0.75vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2vh' }}>Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', paddingLeft: '0.3vw' }}>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Introduction</div>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Existing System
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Literature</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Problem</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Design</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Technical</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Results</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>Overview</div>
        <h1 style={{ fontSize: '3.8vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Existing System</h1>
        <p style={{ fontSize: '1.25vw', color: '#9AA5CE', lineHeight: 1.6, maxWidth: '56vw', margin: '0 0 3vh 0' }}>
          Municipal portals, helplines, and apps allow complaint submission but rely on manual processing, limited tracking, and delayed responses. AI-assisted prioritization and citizen verification remain largely absent.
        </p>
        <div style={{ fontSize: '1.1vw', fontWeight: 600, color: '#FFFFFF', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Limitations of Existing Systems</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2vw', marginBottom: '3vh' }}>
          <div style={{ backgroundColor: 'rgba(255,158,100,0.08)', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'flex-start', gap: '0.8vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', lineHeight: 1.4 }}>Manual complaint verification</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,158,100,0.08)', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'flex-start', gap: '0.8vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', lineHeight: 1.4 }}>Slow issue resolution</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,158,100,0.08)', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'flex-start', gap: '0.8vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', lineHeight: 1.4 }}>Limited complaint tracking</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,158,100,0.08)', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'flex-start', gap: '0.8vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', lineHeight: 1.4 }}>Duplicate complaint submissions</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,158,100,0.08)', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'flex-start', gap: '0.8vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', lineHeight: 1.4 }}>No AI-based prioritization</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,158,100,0.08)', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.5vw', padding: '1.5vh 1.5vw', display: 'flex', alignItems: 'flex-start', gap: '0.8vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', lineHeight: 1.4 }}>Low citizen engagement</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'rgba(122,162,247,0.08)', border: '1px solid rgba(122,162,247,0.25)', borderRadius: '0.5vw', padding: '1.8vh 2vw' }}>
          <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.8vh' }}>Need for the Proposed System</div>
          <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.5 }}>Develop an intelligent, AI-powered platform that automates issue detection, prioritizes complaints, improves transparency, and enables efficient communication between citizens and local authorities.</div>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>03</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
