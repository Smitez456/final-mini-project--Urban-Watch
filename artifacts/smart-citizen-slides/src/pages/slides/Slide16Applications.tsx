export default function Slide16Applications() {
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
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Applications
            </div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Future Scope</div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>Expected Results</div>
        <h1 style={{ fontSize: '3.8vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Applications &amp; Benefits</h1>
        <div style={{ display: 'flex', gap: '3vw', flex: 1 }}>
          {/* Applications */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2vh', paddingBottom: '1.2vh', borderBottom: '1px solid rgba(122,162,247,0.2)' }}>Application Sectors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Municipal Corporations</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Smart City Projects</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Local Self-Government Bodies</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Residential Communities</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Educational Institutions</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Public Infrastructure Maintenance</div>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
          {/* Benefits */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1vw', fontWeight: 700, color: '#9ECE6A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2vh', paddingBottom: '1.2vh', borderBottom: '1px solid rgba(158,206,106,0.2)' }}>Key Benefits</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: 'rgba(158,206,106,0.06)', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.4 }}>Reduces complaint resolution time</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: 'rgba(158,206,106,0.06)', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.4 }}>Improves transparency and accountability</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: 'rgba(158,206,106,0.06)', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.4 }}>Encourages active citizen participation</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: 'rgba(158,206,106,0.06)', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.4 }}>Enables data-driven decision making</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw', padding: '1.4vh 1.5vw', backgroundColor: 'rgba(158,206,106,0.06)', border: '1px solid rgba(158,206,106,0.15)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0, marginTop: '0.4vh' }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5', lineHeight: 1.4 }}>Supports digital governance and Smart City initiatives</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>16</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
