export default function Slide08ScopeMotivation() {
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
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Problem Statement</div>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Scope &amp; Motivation
            </div>
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
        <h1 style={{ fontSize: '4vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Scope &amp; Motivation</h1>
        <div style={{ display: 'flex', gap: '3vw', flex: 1 }}>
          {/* Scope */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2vh', paddingBottom: '1.2vh', borderBottom: '1px solid rgba(122,162,247,0.2)' }}>Project Scope</div>
            <p style={{ fontSize: '1.2vw', color: '#9AA5CE', lineHeight: 1.6, marginBottom: '2vh' }}>An intelligent platform for reporting and managing civic issues, enabling citizens to submit complaints with images and GPS while authorities monitor and resolve them efficiently.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>AI-based issue detection</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>GPS-enabled complaint reporting</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Real-time complaint tracking</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Cloud-based data management</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Citizen feedback and verification</div>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
          {/* Motivation */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1vw', fontWeight: 700, color: '#9ECE6A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2vh', paddingBottom: '1.2vh', borderBottom: '1px solid rgba(158,206,106,0.2)' }}>Why This Project?</div>
            <p style={{ fontSize: '1.2vw', color: '#9AA5CE', lineHeight: 1.6, marginBottom: '2vh' }}>To improve civic issue reporting efficiency by leveraging AI and mobile technology — strengthening citizen-government communication and supporting smart city initiatives.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Faster issue reporting</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Increased transparency</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Better citizen engagement</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Improved public service delivery</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Supports digital governance and Smart Cities</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>08</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
