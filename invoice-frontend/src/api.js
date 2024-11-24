import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/invoices/', // Ensure this is correct
});

// Create a new invoice
export const createInvoice = (data) => API.post('/', data);

// Update an existing invoice
export const updateInvoice = (id, data) => API.put(`/${id}/`, data);
