export default function StatusBar() {
  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 20px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-dim)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--accent-green)',
            animation: 'blink 2s ease-in-out infinite',
          }}
        />
        <span>SYSTEM ONLINE</span>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <span>LAST SYNC: {new Date().toLocaleString('ko-KR', { hour12: false })}</span>
      </div>
      <div style={{ letterSpacing: '0.1em' }}>
        RESTRICTED // ROK-MND // DEEPSTREAM v1.0
      </div>
    </footer>
  );
}
