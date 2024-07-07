const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://danakumarsl21csd:uQPPzhkmdUrfw14R@cluster0.lgd7bkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Contact', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Auth Header:", authHeader);  // Debug log
  console.log("Token:", token);  // Debug log
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'YOUR_SECRET_KEY', (err, user) => {
    if (err) {
      console.log("JWT Verify Error:", err);  // Debug log
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    console.log("Signup Error:", error);  // Debug log
    res.status(400).send('Error creating user');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
  res.json({ token });
});

// Add Contact Route
app.post('/contacts', authenticateToken, async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.send(contact);
  } catch (error) {
    console.log("Add Contact Error:", error);  // Debug log
    res.status(500).send({ error: 'An error occurred while adding the contact.' });
  }
});

// Get All Contacts Route
app.get('/contacts', authenticateToken, async (req, res) => {
  const contacts = await Contact.find();
  res.send(contacts);
});

// Get Contact by ID Route
app.get('/contacts/:id', authenticateToken, async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.send(contact);
});

// Update Contact Route
app.put('/contacts/:id', authenticateToken, async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(contact);
});

// Delete Contact Route
app.delete('/contacts/:id', authenticateToken, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.send({ message: 'Contact deleted' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
