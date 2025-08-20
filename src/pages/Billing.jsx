import React, { useState } from 'react';
import { apiBase } from '../App';

export default function Billing({ token }) {
  const [companyName, setCompanyName] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyGst, setCompanyGst] = useState('');
  const [ratePerTon, setRatePerTon] = useState(0);
  const [trucks, setTrucks] = useState(1);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(null);
  const [creating, setCreating] = useState(false);

  const total = Number(ratePerTon || 0) * Number(trucks || 0);

  const createInvoice = async () => {
    setMessage(null);
    setCreating(true);
    try {
      const res = await fetch(`${apiBase}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ companyName, companyPhone, companyAddress, companyGst, ratePerTon: Number(ratePerTon), trucks: Number(trucks), notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create failed');
      setMessage({ type:'success', text: `Invoice ${data.invoiceNumber} created — Total ₹${data.total}` });
      // reset minimal fields for next invoice
      setCompanyName(''); setCompanyPhone(''); setCompanyAddress(''); setCompanyGst(''); setRatePerTon(0); setTrucks(1); setNotes('');
    } catch (err) {
      setMessage({ type:'error', text: err.message });
    } finally { setCreating(false); }
  };

  return (
    <div>
      <div className="card">
        <h3>New Invoice</h3>
        <div className="form-row">
          <div className="label">Company Name</div>
          <input className="input" value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Customer / Company name" />
        </div>
        <div className="form-row">
          <div className="label">Phone</div>
          <input className="input small" value={companyPhone} onChange={e=>setCompanyPhone(e.target.value)} placeholder="+91..." />
          <div className="label">GST</div>
          <input className="input small" value={companyGst} onChange={e=>setCompanyGst(e.target.value)} placeholder="GSTIN" />
        </div>
        <div className="form-row">
          <div className="label">Address</div>
          <input className="input" value={companyAddress} onChange={e=>setCompanyAddress(e.target.value)} placeholder="Address for invoice" />
        </div>
        <hr style={{margin:'12px 0'}}/>
        <div className="form-row">
          <div className="label">Rate per Ton (₹)</div>
          <input className="input small" type="number" value={ratePerTon} onChange={e=>setRatePerTon(e.target.value)} />
          <div className="label">Trucks (Qty)</div>
          <input className="input small" type="number" value={trucks} onChange={e=>setTrucks(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="label">Notes</div>
          <input className="input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional note" />
        </div>
        <div className="row-right">
          <div className="small-muted">Computed Total</div>
          <div className="footer-total">₹{total}</div>
          <button className="btn" onClick={createInvoice} disabled={creating}>Generate Invoice</button>
        </div>
        {message && <div style={{marginTop:10, color: message.type==='error'?'#b91c1c':'#0b6b2f'}}>{message.text}</div>}
      </div>
    </div>
  );
}
