import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get('http://localhost:5000/contacts', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          }
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Error fetching contacts. Please try again.');
      }
    };

    fetchContacts();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Contact List</h2>
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={() => navigate('/add')} style={styles.button}>Add New Contact</button>
      <ul style={styles.list}>
        {contacts.map(contact => (
          <li key={contact._id} style={styles.listItem}>
            <p>Name: {contact.name}</p>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <button onClick={() => navigate(`/edit/${contact._id}`)} style={styles.button}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  list: { listStyleType: 'none', padding: 0 },
  listItem: { padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  button: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' },
  error: { color: 'red' }
};

export default ContactList;
