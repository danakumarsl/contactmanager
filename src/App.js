import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ContactList from './Components/ContactList';
import AddContact from './Components/AddContact';
import EditContact from './Components/EditContact';

const App = () => {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacts" element={isAuthenticated ? <ContactList /> : <Navigate to="/login" replace />} />
        <Route path="/add" element={isAuthenticated ? <AddContact /> : <Navigate to="/login" replace />} />
        <Route path="/edit/:id" element={isAuthenticated ? <EditContact /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
