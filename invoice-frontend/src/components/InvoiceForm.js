import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceContext from '../context/InvoiceContext';
import axios from 'axios';

const InvoiceForm = () => {
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    customer_name: '',
    date: '',
    details: [{ description: '', quantity: 1, unit_price: 0 }]
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchInvoices } = useContext(InvoiceContext);

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/invoices/${id}/`)
        .then((res) => setInvoice(res.data))
        .catch((err) => console.error('Error fetching invoice:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...invoice.details];
    updatedDetails[index][name] = value;
    setInvoice({ ...invoice, details: updatedDetails });
  };

  const addDetail = () => {
    setInvoice({ ...invoice, details: [...invoice.details, { description: '', quantity: 1, unit_price: 0 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (id) {
        res = await axios.put(`http://127.0.0.1:8000/api/invoices/${id}/`, invoice);
        console.log('Invoice updated:', res.data);
      } else {
        res = await axios.post('http://127.0.0.1:8000/api/invoices/', invoice);
        console.log('Invoice created:', res.data);
      }
  
      fetchInvoices();
      navigate('/');
    } catch (err) {
      console.error('Error response:', err.response || err.message);
      alert(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="invoice_number"
        value={invoice.invoice_number}
        onChange={handleChange}
        placeholder="Invoice Number"
      />
      <input
        name="customer_name"
        value={invoice.customer_name}
        onChange={handleChange}
        placeholder="Customer Name"
      />
      <input
        name="date"
        type="date"
        value={invoice.date}
        onChange={handleChange}
      />

      {invoice.details.map((detail, index) => (
        <div key={index}>
          <input
            name="description"
            value={detail.description}
            onChange={(e) => handleDetailChange(index, e)}
            placeholder="Description"
          />
          <input
            name="quantity"
            type="number"
            value={detail.quantity}
            onChange={(e) => handleDetailChange(index, e)}
            placeholder="Quantity"
          />
          <input
            name="unit_price"
            type="number"
            value={detail.unit_price}
            onChange={(e) => handleDetailChange(index, e)}
            placeholder="Unit Price"
          />
        </div>
      ))}

      <button type="button" onClick={addDetail}>Add Line Item</button>
      <button type="submit">Save</button>
    </form>
  );
};

export default InvoiceForm;
