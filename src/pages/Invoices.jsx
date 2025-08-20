import React, { useEffect, useState } from 'react';
import { apiBase } from '../App';

export default function Invoices({ token }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (p=1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/invoices?page=${p}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error');
      setData(json.data); setPage(json.page); setTotal(json.total);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchPage(1); }, []);

  const downloadPdf = (id) => {
    const url = `${apiBase}/invoices/${id}/pdf`;
    // Open in new tab to trigger download
    window.open(url, '_blank');
  };

  return (
    <div>
      <div className="card">
        <h3>Invoices</h3>
        <p className="small-muted">Total: {total}</p>
        <table className="table">
          <thead><tr><th>Inv #</th><th>Date</th><th>Company</th><th>Trucks</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {data.map(inv => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>{new Date(inv.createdAt).toLocaleString()}</td>
                <td>{inv.companyName}</td>
                <td>{inv.trucks}</td>
                <td>₹{inv.total}</td>
                <td><button className="btn" onClick={()=>downloadPdf(inv._id)}>PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:12}}>
          <div>
            <button onClick={()=>fetchPage(Math.max(1,page-1))} disabled={page<=1}>Prev</button>
            <button onClick={()=>fetchPage(page+1)} style={{marginLeft:8}}>Next</button>
          </div>
          <div className="small-muted">Page {page}</div>
        </div>
      </div>
    </div>
  );
}
