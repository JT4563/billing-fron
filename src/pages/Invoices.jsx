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

  const downloadPdf = async (id, invoiceNumber) => {
    try {
      const response = await fetch(`${apiBase}/invoices/${id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const printInvoice = async (id) => {
    try {
      const response = await fetch(`${apiBase}/invoices/${id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Failed to open invoice for printing. Please try again.');
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Invoices</h3>
        <p className="small-muted">Total: {total}</p>
        <table className="table">
          <thead><tr><th>Inv #</th><th>Date</th><th>Company</th><th>Trucks</th><th>Total</th><th>Actions</th></tr></thead>
          <tbody>
            {data.map(inv => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>{new Date(inv.createdAt).toLocaleString()}</td>
                <td>{inv.companyName}</td>
                <td>{inv.trucks}</td>
                <td>₹{(inv.total || 0).toLocaleString('en-IN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="btn" 
                      onClick={() => downloadPdf(inv._id, inv.invoiceNumber)}
                      style={{ padding: '4px 8px', fontSize: '11px', background: '#059669' }}
                    >
                      📄 PDF
                    </button>
                    <button 
                      className="btn" 
                      onClick={() => printInvoice(inv._id)}
                      style={{ padding: '4px 8px', fontSize: '11px', background: '#0284c7' }}
                    >
                      🖨️ Print
                    </button>
                  </div>
                </td>
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
