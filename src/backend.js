// server.js (or backend.js)
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const uri = "mongodb+srv://namansrivastava1608:lPxyUQgdnV7WSCWw@cluster0.pihej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
const port = 5000;

app.use(cors({
  origin: ['https://quiz-app-phi-ebon.vercel.app', 'http://localhost:3000'], 
}));
app.use(bodyParser.json());

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}
connectDB();

const db = client.db('userDB');
const usersCollection = db.collection('users');

// Handle login/signup requests
app.post('/api/users/:mode', async (req, res) => {
  const { username, password } = req.body;
  const { mode } = req.params;

  try {
    if (mode === 'signup') {
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      await usersCollection.insertOne({ username, password });
      res.status(200).json({ message: 'User signed up successfully' });
    } else if (mode === 'login') {
      const user = await usersCollection.findOne({ username, password });
      if (user) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});