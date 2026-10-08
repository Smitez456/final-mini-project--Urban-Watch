export default function Slide14Requirements() {
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
            <div style={{ fontSize: '0.9vw', color: '#C0CAF5', opacity: 0.5, paddingLeft: '0.8vw' }}>Technology Stack</div>
            <div style={{ fontSize: '0.9vw', color: '#7AA2F7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
              <span style={{ width: '3px', height: '0.9vw', backgroundColor: '#7AA2F7', borderRadius: '2px', flexShrink: 0 }} />
              Requirements
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Results</div>
        <div style={{ fontSize: '0.75vw', fontWeight: 600, color: '#565F89', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2.5vh' }}>Closing</div>
        <div style={{ marginTop: 'auto', fontSize: '0.75vw', color: '#565F89' }}>CSBS • RSET • 2025</div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '7vh 5vw 6vh 5vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ fontSize: '0.9vw', color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '1.5vh' }}>Technical Specifications</div>
        <h1 style={{ fontSize: '3.5vw', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3vh 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Hardware &amp; Software Requirements</h1>
        <div style={{ display: 'flex', gap: '3vw', flex: 1 }}>
          {/* Hardware */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1vw', fontWeight: 700, color: '#E0AF68', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2vh', display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#E0AF68', borderRadius: '50%' }} />
              Hardware Requirements
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Intel Core i5 11th Gen or higher</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>8 GB RAM (Minimum)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>256 GB SSD</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Android Smartphone (Android 10+)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.4vh 1.5vw', backgroundColor: '#16161E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5vw' }}>
                <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#E0AF68', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ fontSize: '1.15vw', color: '#C0CAF5' }}>Stable Internet Connection</div>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
          {/* Software */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1vw', fontWeight: 700, color: '#7AA2F7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2vh', display: 'flex', alignItems: 'center', gap: '0.7vw' }}>
              <div style={{ width: '0.5vw', height: '0.5vw', backgroundColor: '#7AA2F7', borderRadius: '50%' }} />
              Software Requirements
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>01</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Windows 10 / 11</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>02</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Android Studio</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>03</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Visual Studio Code</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>04</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Flutter SDK</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>05</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Dart SDK</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>06</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Python 3.x</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>07</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Firebase</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>08</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Google Maps API</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9vw', color: '#9ECE6A', width: '1vw', textAlign: 'right', flexShrink: 0 }}>09</div>
                <div style={{ fontSize: '1.1vw', color: '#C0CAF5' }}>Git &amp; GitHub</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9vw', color: '#565F89', fontFamily: "'DM Mono', monospace" }}>14</div>
          <div style={{ fontSize: '0.8vw', color: '#565F89' }}>Rajagiri School of Engineering &amp; Technology</div>
        </div>
      </div>
    </div>
  );
}
