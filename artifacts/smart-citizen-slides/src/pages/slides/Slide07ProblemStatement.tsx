export default function Slide07ProblemStatement() {
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
        <div style={{ marginBottom: '2.5vh' }}>
          <div style={{ fontSize: '0.75vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2vh' }}>Problem</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', paddingLeft: '0.3vw' }}>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Problem Statement
            </div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Scope &amp; Motivation</div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Objectives</div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Design</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Technical</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Results</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>Problem Statement</div>
        <h1 style={{ fontSize: '4vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2.5vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Problem Statement</h1>
        <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid #7AA2F7', borderRadius: '0 0.5vw 0.5vw 0', padding: '2vh 2vw', marginBottom: '3.5vh', maxWidth: '58vw' }}>
          <div style={{ fontSize: '1.3vw', color: '#9AA5CE', lineHeight: 1.65 }}>Urban areas face civic issues such as potholes, garbage accumulation, damaged street lights, water leaks, and drainage problems. Existing complaint systems are often slow, lack transparency, and provide limited tracking. Citizens frequently do not receive timely updates, resulting in delayed resolutions and reduced public trust.</div>
        </div>
        <div style={{ fontSize: '1.05vw', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2vh' }}>Key Challenges</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ width: '2.5vw', height: '2.5vw', borderRadius: '50%', backgroundColor: 'rgba(255,158,100,0.12)', border: '1px solid rgba(255,158,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace" }}>01</div>
            </div>
            <div style={{ fontSize: '1.25vw', color: '#C0CAF5' }}>Slow complaint registration and processing</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ width: '2.5vw', height: '2.5vw', borderRadius: '50%', backgroundColor: 'rgba(255,158,100,0.12)', border: '1px solid rgba(255,158,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace" }}>02</div>
            </div>
            <div style={{ fontSize: '1.25vw', color: '#C0CAF5' }}>Manual verification of reported issues</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ width: '2.5vw', height: '2.5vw', borderRadius: '50%', backgroundColor: 'rgba(255,158,100,0.12)', border: '1px solid rgba(255,158,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace" }}>03</div>
            </div>
            <div style={{ fontSize: '1.25vw', color: '#C0CAF5' }}>Lack of real-time complaint tracking</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ width: '2.5vw', height: '2.5vw', borderRadius: '50%', backgroundColor: 'rgba(255,158,100,0.12)', border: '1px solid rgba(255,158,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace" }}>04</div>
            </div>
            <div style={{ fontSize: '1.25vw', color: '#C0CAF5' }}>No AI-based issue classification and prioritization</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
            <div style={{ width: '2.5vw', height: '2.5vw', borderRadius: '50%', backgroundColor: 'rgba(255,158,100,0.12)', border: '1px solid rgba(255,158,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.1vw', fontWeight: 700, color: '#FF9E64', fontFamily: "'DM Mono', monospace" }}>05</div>
            </div>
            <div style={{ fontSize: '1.25vw', color: '#C0CAF5' }}>Limited communication between citizens and authorities</div>
          </div>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>07</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
