export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.2)', borderTop: '1px solid #C9A84C', animation: 'spin 0.9s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
