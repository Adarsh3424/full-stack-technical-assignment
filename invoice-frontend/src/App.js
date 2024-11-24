import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import { InvoiceProvider } from './context/InvoiceContext';

const App = () => {
  return (
    <InvoiceProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/create" element={<InvoiceForm />} />
            <Route path="/edit/:id" element={<InvoiceForm />} />
          </Routes>
        </div>
      </Router>
    </InvoiceProvider>
  );
};

export default App;
