export default function Slide01Title() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#1A1B26',
      }}
    >
      {/* Hero background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${import.meta.env.BASE_URL}title-hero.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Gradient overlay: dark at bottom for legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(26,27,38,0.45) 0%, rgba(26,27,38,0.72) 42%, rgba(26,27,38,0.97) 78%, #1A1B26 100%)',
          zIndex: 1,
        }}
      />

      {/* Top-left logo badge */}
      <div
        style={{
          position: 'absolute',
          top: '4vh',
          left: '4vw',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8vw',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: '2vw',
            height: '2vw',
            backgroundColor: '#7AA2F7',
            borderRadius: '0.45vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '0.85vw',
              height: '0.85vw',
              backgroundColor: '#1A1B26',
              borderRadius: '0.15vw',
            }}
          />
        </div>
        <div style={{ fontSize: '1.2vw', fontWeight: 700, color: '#FFFFFF' }}>
          SmartCitizen
        </div>
      </div>

      {/* Top-right institution badge */}
      <div
        style={{
          position: 'absolute',
          top: '4vh',
          right: '4vw',
          fontSize: '0.85vw',
          color: 'rgba(192,202,245,0.7)',
          fontFamily: "'DM Mono', monospace",
          zIndex: 2,
          textAlign: 'right',
        }}
      >
        CSBS &bull; RSET &bull; 2025
      </div>

      {/* Content block pinned to bottom */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 7vw 6vh 7vw',
        }}
      >
        {/* Slide type label */}
        <div
          style={{
            display: 'inline-block',
            fontSize: '0.8vw',
            fontWeight: 700,
            color: '#7AA2F7',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            backgroundColor: 'rgba(122,162,247,0.12)',
            border: '1px solid rgba(122,162,247,0.3)',
            borderRadius: '0.4vw',
            padding: '0.5vh 1.2vw',
            marginBottom: '2.4vh',
          }}
        >
          Mini Project Abstract Presentation
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: '5.8vw',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 1vh 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            textShadow: '0 2px 24px rgba(0,0,0,0.45)',
          }}
        >
          Smart Citizen
          <br />
          <span style={{ color: '#7AA2F7' }}>Assistant App</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.6vw',
            color: '#9AA5CE',
            margin: '0 0 4vh 0',
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          An AI-Powered Civic Issue Reporting Platform
        </p>

        {/* Divider */}
        <div
          style={{
            width: '8vw',
            height: '2px',
            background: 'linear-gradient(to right, #7AA2F7, transparent)',
            marginBottom: '4vh',
          }}
        />

        {/* Team + guide row */}
        <div
          style={{
            display: 'flex',
            gap: '6vw',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {/* Team */}
          <div>
            <div
              style={{
                fontSize: '0.7vw',
                fontWeight: 700,
                color: '#565F89',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '1vh',
              }}
            >
              Presented by
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5vh',
              }}
            >
              {['Mark Sumesh Paul', 'Steve Sumesh Paul', 'Patrick John Paul', '___________'].map(
                (name, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '1vw',
                      color: '#C0CAF5',
                      fontWeight: i === 0 ? 600 : 400,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {name}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Guide */}
          <div>
            <div
              style={{
                fontSize: '0.7vw',
                fontWeight: 700,
                color: '#565F89',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '1vh',
              }}
            >
              Under the guidance of
            </div>
            <div
              style={{
                fontSize: '1vw',
                color: '#C0CAF5',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Asst. Prof. Ms. Gracemol Thankachan
            </div>
          </div>

          {/* Department */}
          <div>
            <div
              style={{
                fontSize: '0.7vw',
                fontWeight: 700,
                color: '#565F89',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '1vh',
              }}
            >
              Department
            </div>
            <div
              style={{
                fontSize: '1vw',
                color: '#C0CAF5',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Computer Science &amp; Business Systems
            </div>
            <div
              style={{
                fontSize: '0.9vw',
                color: '#9AA5CE',
                fontFamily: "'DM Mono', monospace",
                marginTop: '0.4vh',
              }}
            >
              Rajagiri School of Engineering &amp; Technology
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
