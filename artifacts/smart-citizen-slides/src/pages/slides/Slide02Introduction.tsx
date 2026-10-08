export default function Slide02Introduction() {
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
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Introduction
            </div>
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Existing System</div>
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
        <h1 style={{ fontSize: '4vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 2vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Introduction</h1>
        <p style={{ fontSize: '1.35vw', color: '#9AA5CE', lineHeight: 1.65, maxWidth: '56vw', margin: '0 0 2vh 0', fontWeight: 400 }}>
          With rapid urbanization, cities face increasing civic issues — potholes, garbage accumulation, water leaks, damaged streetlights, and drainage problems. Existing complaint systems are often slow, lack transparency, and provide limited communication between citizens and authorities.
        </p>
        <p style={{ fontSize: '1.35vw', color: '#9AA5CE', lineHeight: 1.65, maxWidth: '56vw', margin: '0 0 3.5vh 0', fontWeight: 400 }}>
          The <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Smart Citizen Assistant App</span> enables citizens to report civic issues by uploading images and GPS locations — automatically categorizing complaints, assigning priority, and tracking resolution in real time.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2vw' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw', backgroundColor: 'rgba(122,162,247,0.1)', border: '1px solid rgba(122,162,247,0.25)', borderRadius: '0.5vw', padding: '1.2vh 1.6vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', fontWeight: 500 }}>AI-based civic issue reporting</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw', backgroundColor: 'rgba(158,206,106,0.1)', border: '1px solid rgba(158,206,106,0.25)', borderRadius: '0.5vw', padding: '1.2vh 1.6vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', fontWeight: 500 }}>GPS-enabled location tracking</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw', backgroundColor: 'rgba(224,175,104,0.1)', border: '1px solid rgba(224,175,104,0.25)', borderRadius: '0.5vw', padding: '1.2vh 1.6vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', fontWeight: 500 }}>Real-time complaint monitoring</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw', backgroundColor: 'rgba(122,162,247,0.1)', border: '1px solid rgba(122,162,247,0.25)', borderRadius: '0.5vw', padding: '1.2vh 1.6vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#7AA2F7', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', fontWeight: 500 }}>Faster authority communication</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw', backgroundColor: 'rgba(158,206,106,0.1)', border: '1px solid rgba(158,206,106,0.25)', borderRadius: '0.5vw', padding: '1.2vh 1.6vw' }}>
            <div style={{ width: '0.55vw', height: '0.55vw', backgroundColor: '#9ECE6A', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ fontSize: '1.1vw', color: '#C0CAF5', fontWeight: 500 }}>Supports Smart City initiatives</div>
          </div>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>02</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
