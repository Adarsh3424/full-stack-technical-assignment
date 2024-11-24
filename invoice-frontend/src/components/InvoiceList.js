import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import InvoiceContext from '../context/InvoiceContext';
import axios from 'axios';

const InvoiceList = () => {
  const { invoices, loading, error, fetchInvoices } = useContext(InvoiceContext);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/invoices/${id}/`);
      fetchInvoices();
    } catch (err) {
      alert('Error deleting invoice');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Invoices</h1>
      <Link to="/create" className="btn">Create Invoice</Link>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.id}>
            <h2>{invoice.invoice_number} - {invoice.customer_name}</h2>
            <p>{invoice.date}</p>
            <Link to={`/edit/${invoice.id}`} className="btn">Edit</Link>
            <button onClick={() => handleDelete(invoice.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
