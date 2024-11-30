import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';




// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the Vue.js app
app.use(express.static(path.join(__dirname, 'dist')));

// Test route to check server status
app.get('/', (req, res) => {
  res.send('Server is running on http://localhost:3000');
});

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Store nominees on the backend
let nominees = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send initial nominees list when a client connects
  socket.emit('nomineeUpdate', nominees);

  // Add nominee
  socket.on('addNominee', (nominee) => {
    nominees.push(nominee);
    io.emit('nomineeUpdate', nominees);
  });

  // Rename nominee
  socket.on('renameNominee', (updatedNominee) => {
    const index = nominees.findIndex(n => n.id === updatedNominee.id);
    if (index !== -1) {
      nominees[index] = updatedNominee;
      io.emit('nomineeUpdate', nominees);
    }
  });

  // Reset nominee score
  socket.on('resetNomineeScore', (nomineeId) => {
    const nominee = nominees.find(n => n.id === nomineeId);
    if (nominee) {
      nominee.score = 0;
      io.emit('nomineeUpdate', nominees);
    }
  });

  // Adjust nominee score
  socket.on('adjustScore', (nomineeId, change) => {
    const nominee = nominees.find(n => n.id === nomineeId);
    if (nominee) {
      nominee.score += change;
      io.emit('nomineeUpdate', nominees);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Voucher Validation Route
app.post('/validate-voucher', async (req, res) => {
  const { email, voucherCode } = req.body;

  if (!email || !voucherCode) {
    return res.status(400).send('Email and voucher code are required');
  }

  try {
    // Query Firestore for the user with the given email
    const userRef = admin.firestore().collection('users').where('Email', '==', email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      console.log('No user found for the provided email.');
      return res.status(404).send('Invalid email or voucher code');
    }

    let userVoucher = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('User Document Data:', data);
      userVoucher = data.Voucher;
    });

    // Check if the provided voucher matches the stored voucher
    if (userVoucher !== voucherCode) {
      console.log('Voucher code mismatch.');
      return res.status(400).send('Invalid email or voucher code');
    }

    // Successful validation
    console.log('Voucher validated successfully.');
    res.status(200).send('Voucher validated successfully');
  } catch (error) {
    console.error('Error validating voucher:', error);
    res.status(500).send('An error occurred while validating the voucher');
  }
});

// Listen on a port (example: 3000)
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
