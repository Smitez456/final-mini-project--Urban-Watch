export default function Slide12Architecture() {
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
        <div style={{ marginBottom: '2.5vh' }}>
          <div style={{ fontSize: '0.75vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2vh' }}>Design</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', paddingLeft: '0.3vw' }}>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Methodology</div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Modules</div>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Architecture
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Technical</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Results</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '6vh 4vw 5vh 4vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.2vh' }}>System Design</div>
        <h1 style={{ fontSize: '3.5vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2.5vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>System Architecture</h1>
        {/* Architecture Diagram */}
        <div style={{ display: 'flex', gap: '3vw', flex: 1 }}>
          {/* Left flow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flex: 1 }}>
            {/* Citizen */}
            <div style={{ width: '100%', backgroundColor: 'rgba(122,162,247,0.12)', border: '1px solid rgba(122,162,247,0.35)', borderRadius: '0.5vw', padding: '1.3vh 0', textAlign: 'center', fontSize: '1.15vw', fontWeight: 700, color: '#7AA2F7' }}>Citizen</div>
            <div style={{ width: '2px', height: '2.5vh', backgroundColor: 'rgba(122,162,247,0.4)' }} />
            {/* Flutter App */}
            <div style={{ width: '100%', backgroundColor: 'rgba(122,162,247,0.08)', border: '2px solid rgba(122,162,247,0.4)', borderRadius: '0.5vw', padding: '1.3vh 0', textAlign: 'center', fontSize: '1.15vw', fontWeight: 700, color: '#FFFFFF' }}>Flutter Mobile App</div>
            <div style={{ width: '2px', height: '1.5vh', backgroundColor: 'rgba(122,162,247,0.4)' }} />
            {/* Three services */}
            <div style={{ display: 'flex', gap: '1vw', width: '100%' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(158,206,106,0.08)', border: '1px solid rgba(158,206,106,0.3)', borderRadius: '0.4vw', padding: '1vh 0', textAlign: 'center', fontSize: '0.9vw', color: '#9ECE6A', fontWeight: 600 }}>Google Maps</div>
              <div style={{ flex: 1, backgroundColor: 'rgba(158,206,106,0.08)', border: '1px solid rgba(158,206,106,0.3)', borderRadius: '0.4vw', padding: '1vh 0', textAlign: 'center', fontSize: '0.9vw', color: '#9ECE6A', fontWeight: 600 }}>Firebase Auth</div>
              <div style={{ flex: 1, backgroundColor: 'rgba(158,206,106,0.08)', border: '1px solid rgba(158,206,106,0.3)', borderRadius: '0.4vw', padding: '1vh 0', textAlign: 'center', fontSize: '0.9vw', color: '#9ECE6A', fontWeight: 600 }}>Camera / Gallery</div>
            </div>
            <div style={{ width: '2px', height: '2.5vh', backgroundColor: 'rgba(158,206,106,0.4)' }} />
            {/* Firestore */}
            <div style={{ width: '100%', backgroundColor: 'rgba(158,206,106,0.1)', border: '1px solid rgba(158,206,106,0.3)', borderRadius: '0.5vw', padding: '1.3vh 0', textAlign: 'center', fontSize: '1.15vw', fontWeight: 700, color: '#9ECE6A' }}>Firebase Firestore</div>
            <div style={{ width: '2px', height: '2.5vh', backgroundColor: 'rgba(224,175,104,0.4)' }} />
            {/* AI Processing */}
            <div style={{ width: '100%', backgroundColor: 'rgba(224,175,104,0.1)', border: '1px solid rgba(224,175,104,0.3)', borderRadius: '0.5vw', padding: '1.3vh 0', textAlign: 'center', fontSize: '1.15vw', fontWeight: 700, color: '#E0AF68' }}>AI Processing API</div>
            <div style={{ width: '2px', height: '2.5vh', backgroundColor: 'rgba(224,175,104,0.4)' }} />
            {/* Priority */}
            <div style={{ width: '100%', backgroundColor: 'rgba(224,175,104,0.08)', border: '1px solid rgba(224,175,104,0.25)', borderRadius: '0.5vw', padding: '1.3vh 0', textAlign: 'center', fontSize: '1.15vw', fontWeight: 700, color: '#E0AF68' }}>Priority Classification</div>
            <div style={{ width: '2px', height: '2.5vh', backgroundColor: 'rgba(255,158,100,0.4)' }} />
            {/* Authority */}
            <div style={{ width: '100%', backgroundColor: 'rgba(255,158,100,0.1)', border: '1px solid rgba(255,158,100,0.3)', borderRadius: '0.5vw', padding: '1.3vh 0', textAlign: 'center', fontSize: '1.15vw', fontWeight: 700, color: '#FF9E64' }}>Authority Dashboard</div>
            <div style={{ width: '2px', height: '2.5vh', backgroundColor: 'rgba(255,158,100,0.4)' }} />
            {/* Status */}
            <div style={{ display: 'flex', gap: '1vw', width: '100%' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(122,162,247,0.08)', border: '1px solid rgba(122,162,247,0.25)', borderRadius: '0.4vw', padding: '1vh 0', textAlign: 'center', fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600 }}>Status Update</div>
              <div style={{ flex: 1, backgroundColor: 'rgba(122,162,247,0.08)', border: '1px solid rgba(122,162,247,0.25)', borderRadius: '0.4vw', padding: '1vh 0', textAlign: 'center', fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600 }}>Notification to Citizen</div>
            </div>
          </div>
          {/* Legend */}
          <div style={{ width: '14vw', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2vh', paddingTop: '1vh' }}>
            <div style={{ fontSize: '0.85vw', fontWeight: 700, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5vh' }}>Legend</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <div style={{ width: '2.5vw', height: '1.5vh', backgroundColor: 'rgba(122,162,247,0.2)', border: '1px solid rgba(122,162,247,0.4)', borderRadius: '0.2vw' }} />
              <div style={{ fontSize: '1vw', color: '#9AA5CE' }}>User / App Layer</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <div style={{ width: '2.5vw', height: '1.5vh', backgroundColor: 'rgba(158,206,106,0.15)', border: '1px solid rgba(158,206,106,0.4)', borderRadius: '0.2vw' }} />
              <div style={{ fontSize: '1vw', color: '#9AA5CE' }}>Firebase Services</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <div style={{ width: '2.5vw', height: '1.5vh', backgroundColor: 'rgba(224,175,104,0.15)', border: '1px solid rgba(224,175,104,0.4)', borderRadius: '0.2vw' }} />
              <div style={{ fontSize: '1vw', color: '#9AA5CE' }}>AI Processing</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <div style={{ width: '2.5vw', height: '1.5vh', backgroundColor: 'rgba(255,158,100,0.15)', border: '1px solid rgba(255,158,100,0.4)', borderRadius: '0.2vw' }} />
              <div style={{ fontSize: '1vw', color: '#9AA5CE' }}>Authority Layer</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>12</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
