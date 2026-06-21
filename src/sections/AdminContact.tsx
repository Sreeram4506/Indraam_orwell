import { useEffect, useMemo, useState } from 'react';

type ContactSubmission = {
  name: string;
  email: string;
  business: string;
  phone: string;
  message: string;
  interests: string[];
  createdAt?: string; // optional ISO string
};

const STORAGE_KEY = 'contact_submissions_v1';

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function AdminContact() {
  const [query, setQuery] = useState('');
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  const load = () => {
    const parsed = safeParse<ContactSubmission[]>(localStorage.getItem(STORAGE_KEY));
    setSubmissions(Array.isArray(parsed) ? parsed : []);
  };

  useEffect(() => {
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter((s) => {
      const blob = [
        s.name,
        s.email,
        s.business,
        s.phone,
        s.message,
        ...(s.interests ?? []),
        s.createdAt ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return blob.includes(q);
    });
  }, [query, submissions]);

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSubmissions([]);
  };

  const close = () => {
    // Matches existing usage in App.tsx which checks pathname and hash.
    window.location.hash = '';
    // If user opened /admin directly, force back to main.
    if (window.location.pathname === '/admin') window.location.pathname = '/';
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0b0b',
        color: '#f5f5f5',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontWeight: 700, fontSize: 20 }}>
            Admin Contact Submissions
          </div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>Stored in localStorage: {STORAGE_KEY}</div>
        </div>

        <button
          onClick={close}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name/email/business/interest/message..."
          style={{
            flex: '1 1 340px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            padding: '12px 14px',
            borderRadius: 10,
            outline: 'none',
          }}
        />

        <button
          onClick={load}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            padding: '12px 14px',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>

        <button
          onClick={clearAll}
          style={{
            background: '#cc0000',
            border: '1px solid #cc0000',
            color: '#fff',
            padding: '12px 14px',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          Clear all
        </button>
      </div>

      <div style={{ opacity: 0.8, fontSize: 13 }}>
        Showing {filtered.length} of {submissions.length} submissions
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ opacity: 0.7, padding: 16, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 12 }}>
            No submissions found.
          </div>
        ) : (
          filtered
            .slice()
            .reverse()
            .map((s, idx) => (
              <div
                key={`${s.email}-${s.createdAt ?? idx}`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{s.name || '—'}</div>
                  <div style={{ opacity: 0.75, fontSize: 12 }}>{s.email || '—'}</div>
                  <div style={{ opacity: 0.65, fontSize: 12 }}>• {formatTime(s.createdAt)}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  <div style={{ opacity: 0.8, fontSize: 12 }}>
                    <div style={{ opacity: 0.6, marginBottom: 4 }}>Business</div>
                    <div style={{ wordBreak: 'break-word' }}>{s.business || '—'}</div>
                  </div>
                  <div style={{ opacity: 0.8, fontSize: 12 }}>
                    <div style={{ opacity: 0.6, marginBottom: 4 }}>Phone</div>
                    <div style={{ wordBreak: 'break-word' }}>{s.phone || '—'}</div>
                  </div>
                </div>

                <div style={{ opacity: 0.8, fontSize: 12 }}>
                  <div style={{ opacity: 0.6, marginBottom: 4 }}>Interests</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(s.interests && s.interests.length > 0 ? s.interests : ['—']).map((it, i) => (
                      <span
                        key={`${it}-${i}`}
                        style={{
                          fontSize: 11,
                          padding: '6px 10px',
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.18)',
                          background: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ opacity: 0.8, fontSize: 12 }}>
                  <div style={{ opacity: 0.6, marginBottom: 4 }}>Message</div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {s.message || '—'}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
