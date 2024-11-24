import React, { createContext, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]); // State for invoices
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(''); // State for error messages

  // Fetch invoices from the API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/invoices/');
      setInvoices(response.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Error fetching invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider value={{ invoices, fetchInvoices, loading, error }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceContext;
