import React, { useState } from 'react';
import { apiBase } from '../App';

export default function Login({ onSignIn }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ accessCode: code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign-in failed');
      onSignIn(data.token);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{display:'grid',placeItems:'center',height:'100vh'}}>
      <div className="card" style={{width:420}}>
        <h2>Owner Access</h2>
        <p className="small-muted">Enter the access code given by the system administrator.</p>
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="label">Access Code</div>
            <input className="input" value={code} onChange={e=>setCode(e.target.value)} />
          </div>
          {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
            <button className="btn" onClick={submit} disabled={loading}>{loading? 'Signing...':'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
