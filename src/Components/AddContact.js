import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/contacts', { name, email, phone }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/contacts');
    } catch (error) {
      setError('Error adding contact. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          style={styles.input}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={styles.input}
          required
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          style={styles.input}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Add Contact</button>
        <button type="button" onClick={() => navigate('/contacts')} style={styles.button}>Back to Contact List</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '500px', margin: '0 auto' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { marginBottom: '10px', padding: '10px', fontSize: '16px' },
  button: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '10px' },
  error: { color: 'red' }
};

export default AddContact;
