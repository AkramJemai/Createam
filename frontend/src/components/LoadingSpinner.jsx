import { Loader } from 'lucide-react';
export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 0',
      minHeight: '400px'
    }}>
      <Loader
        size={50}
        style={{
          color: 'var(--primary)',
          marginBottom: '20px',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ color: '#999', fontSize: '1rem', fontWeight: '500' }}>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
