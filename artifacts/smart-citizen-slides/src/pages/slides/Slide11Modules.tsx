export default function Slide11Modules() {
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
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Modules
            </div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Architecture</div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Technical</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Results</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>System Design</div>
        <h1 style={{ fontSize: '3.8vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>System Modules</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw', flex: 1 }}>
          {/* Module 1 */}
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(122,162,247,0.2)', borderRadius: '0.7vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '2vh' }}>
              <div style={{ width: '3vw', height: '3vw', borderRadius: '0.6vw', backgroundColor: 'rgba(122,162,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.2vw', fontWeight: 800, color: '#7AA2F7', fontFamily: "'DM Mono', monospace" }}>M1</div>
              </div>
              <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF' }}>User Management</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>User Registration &amp; Login</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Profile Management</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Authentication using Firebase</div>
              </div>
            </div>
          </div>
          {/* Module 2 */}
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(158,206,106,0.2)', borderRadius: '0.7vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '2vh' }}>
              <div style={{ width: '3vw', height: '3vw', borderRadius: '0.6vw', backgroundColor: 'rgba(158,206,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.2vw', fontWeight: 800, color: '#9ECE6A', fontFamily: "'DM Mono', monospace" }}>M2</div>
              </div>
              <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF' }}>Complaint Reporting</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Capture / Upload Issue Image</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Enter Description</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>GPS-based Location Detection</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Submit Complaint</div>
              </div>
            </div>
          </div>
          {/* Module 3 */}
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(224,175,104,0.2)', borderRadius: '0.7vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '2vh' }}>
              <div style={{ width: '3vw', height: '3vw', borderRadius: '0.6vw', backgroundColor: 'rgba(224,175,104,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.2vw', fontWeight: 800, color: '#E0AF68', fontFamily: "'DM Mono', monospace" }}>M3</div>
              </div>
              <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF' }}>AI Issue Analysis</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Detect Issue Type (Pothole, Garbage, etc.)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Assign Priority (High / Medium / Low)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Validate Uploaded Images</div>
              </div>
            </div>
          </div>
          {/* Module 4 */}
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,158,100,0.2)', borderRadius: '0.7vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '2vh' }}>
              <div style={{ width: '3vw', height: '3vw', borderRadius: '0.6vw', backgroundColor: 'rgba(255,158,100,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.2vw', fontWeight: 800, color: '#FF9E64', fontFamily: "'DM Mono', monospace" }}>M4</div>
              </div>
              <div style={{ fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF' }}>Tracking &amp; Notifications</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Track Complaint Status</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Receive Notifications</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>Verify Completed Repairs</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
                <div style={{ width: '0.4vw', height: '0.4vw', backgroundColor: '#FF9E64', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.1vw', color: '#9AA5CE' }}>View Complaint History</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>11</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
