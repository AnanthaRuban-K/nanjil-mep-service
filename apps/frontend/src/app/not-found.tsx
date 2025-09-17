'use client'

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          404
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Page not found
        </p>
        <a 
          href="/" 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
