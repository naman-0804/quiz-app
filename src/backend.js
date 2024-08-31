// server.js (or backend.js)
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// Configure CORS
app.use(cors({
  origin: '*', // Allow requests from this origin

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
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await usersCollection.findOne({ username, password });
      if (user) {
        res.status(200).json({ message: 'Login successful', userId: user._id.toString() });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  });

// GET user details by userId
app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Convert userId to ObjectId
    const objectId = new ObjectId(userId);
    const user = await usersCollection.findOne({ _id: objectId });

    if (user) {
      res.status(200).json({ username: user.username });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

app.listen(port, () => {
  console.log('Server is running on http://localhost:${port}');
});