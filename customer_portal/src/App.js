import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Dito natin tinatawag yung pinaghiwalay nating files
// src/App.js
import CustomerApp from './customer/components/CustomerApp'; // Updated path 

function App() {
  return (

<Router basename="/pastry_system/customer">
  <Routes>
    <Route path="/*" element={<CustomerApp />} />
  </Routes>
</Router>
  );
}

export default App;