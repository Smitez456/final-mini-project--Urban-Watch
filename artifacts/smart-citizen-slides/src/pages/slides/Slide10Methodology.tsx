export default function Slide10Methodology() {
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
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Methodology
            </div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Modules</div>
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
        <h1 style={{ fontSize: '3.8vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2.5vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Proposed Methodology</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5vw', flex: 1 }}>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid #7AA2F7', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#7AA2F7', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 01</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>User Login</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>Secure authentication via Firebase Auth</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid #7AA2F7', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#7AA2F7', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 02</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>Capture Image</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>User captures or uploads an issue photo</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid #7AA2F7', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#7AA2F7', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 03</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>GPS Location</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>Automatic location detection via GPS</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(158,206,106,0.4)', borderTop: '2px solid #9ECE6A', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#9ECE6A', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 04</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>AI Issue Detection</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>AI analyzes the image and identifies issue type</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(158,206,106,0.4)', borderTop: '2px solid #9ECE6A', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#9ECE6A', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 05</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>Priority Assignment</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>System assigns High / Medium / Low priority</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(158,206,106,0.4)', borderTop: '2px solid #9ECE6A', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#9ECE6A', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 06</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>Store in Firebase</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>Complaint details saved to Cloud Firestore</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(224,175,104,0.4)', borderTop: '2px solid #E0AF68', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#E0AF68', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 07</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>Authority Dashboard</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>Officials receive and process the complaint</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(224,175,104,0.4)', borderTop: '2px solid #E0AF68', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#E0AF68', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 08</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>Complaint Resolution</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>Issue resolved and status updated live</div>
          </div>
          <div style={{ backgroundColor: '#16161E', border: '1px solid rgba(224,175,104,0.4)', borderTop: '2px solid #E0AF68', borderRadius: '0 0 0.5vw 0.5vw', padding: '2vh 1.8vw' }}>
            <div style={{ fontSize: '0.8vw', fontWeight: 700, color: '#E0AF68', fontFamily: "'DM Mono', monospace", marginBottom: '1vh' }}>STEP 09</div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.8vh' }}>Citizen Verification</div>
            <div style={{ fontSize: '1.05vw', color: '#9AA5CE', lineHeight: 1.45 }}>Citizen confirms the issue has been resolved</div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>10</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
